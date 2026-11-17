import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const siteUrl = process.argv[2] ?? 'http://127.0.0.1:4173/';
const driverUrl = 'http://127.0.0.1:9516';
const driver = spawn('chromedriver', ['--port=9516', '--allowed-ips=127.0.0.1'], {
  stdio: ['ignore', 'ignore', 'inherit'],
});

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function request(path, body, method = body === undefined ? 'GET' : 'POST') {
  const response = await fetch(`${driverUrl}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || result.value?.error) {
    throw new Error(`${path}: ${JSON.stringify(result.value ?? result)}`);
  }
  return result.value;
}

async function waitForDriver() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      await request('/status');
      return;
    } catch {
      await sleep(100);
    }
  }
  throw new Error('chromedriver did not start');
}

async function createSession(mobile) {
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${mobile ? '390,844' : '1365,900'}`,
  ];
  const chromeOptions = { args };
  if (mobile) {
    chromeOptions.mobileEmulation = {
      deviceMetrics: { width: 390, height: 844, pixelRatio: 2, touch: true },
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36',
    };
  }
  const session = await request('/session', {
    capabilities: {
      alwaysMatch: {
        browserName: 'chrome',
        'goog:chromeOptions': chromeOptions,
      },
    },
  });
  return session.sessionId;
}

async function execute(sessionId, script, args = []) {
  return request(`/session/${sessionId}/execute/sync`, { script, args });
}

async function screenshot(sessionId, path) {
  const encoded = await request(`/session/${sessionId}/screenshot`);
  await writeFile(path, Buffer.from(encoded, 'base64'));
}

async function verifyViewport({ mobile, screenshotPath }) {
  const sessionId = await createSession(mobile);
  try {
    await request(`/session/${sessionId}/url`, { url: siteUrl });
    await sleep(1800);
    const canvas = await execute(
      sessionId,
      `
        const canvas = document.querySelector('.ascii-hero canvas');
        if (!canvas) throw new Error('ASCII greeting canvas not found');
        const rect = canvas.getBoundingClientRect();
        window.__asciiErrors = [];
        window.addEventListener('error', event => window.__asciiErrors.push(String(event.error || event.message)));
        window.addEventListener('unhandledrejection', event => window.__asciiErrors.push(String(event.reason)));
        return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      `,
    );

    await execute(
      sessionId,
      `
        const canvas = document.querySelector('.ascii-hero canvas');
        const context = canvas.getContext('2d');
        const baseline = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const bands = 5;
        const maxChanged = Array(bands).fill(0);
        const firstChangedAt = Array(bands).fill(null);
        const startedAt = performance.now();
        window.__asciiFrames = {
          maxChanged,
          firstChangedAt,
          finalChanged: Array(bands).fill(0),
          frames: 0,
          finished: false,
        };
        const record = () => {
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          const changed = Array(bands).fill(0);
          for (let offset = 0; offset < pixels.length; offset += 4) {
            const pixel = offset / 4;
            const x = pixel % canvas.width;
            const band = Math.min(bands - 1, Math.floor((x / canvas.width) * bands));
            const delta =
              Math.abs(pixels[offset] - baseline[offset]) +
              Math.abs(pixels[offset + 1] - baseline[offset + 1]) +
              Math.abs(pixels[offset + 2] - baseline[offset + 2]) +
              Math.abs(pixels[offset + 3] - baseline[offset + 3]);
            if (delta > 24) changed[band] += 1;
          }
          const elapsed = performance.now() - startedAt;
          changed.forEach((value, band) => {
            if (value > maxChanged[band]) maxChanged[band] = value;
            if (value > 3 && firstChangedAt[band] === null) firstChangedAt[band] = Math.round(elapsed);
          });
          window.__asciiFrames.finalChanged = changed;
          window.__asciiFrames.frames += 1;
          if (elapsed < 2400) requestAnimationFrame(record);
          else window.__asciiFrames.finished = true;
        };
        requestAnimationFrame(record);
      `,
    );

    const startX = Math.round(canvas.left + canvas.width * 0.12);
    const startY = Math.round(canvas.top + canvas.height * 0.5);
    const pointerType = mobile ? 'touch' : 'mouse';
    await request(`/session/${sessionId}/actions`, {
      actions: [
        {
          type: 'pointer',
          id: mobile ? 'finger' : 'mouse',
          parameters: { pointerType },
          actions: [
            { type: 'pointerMove', origin: 'viewport', x: startX, y: startY, duration: 0 },
            ...(mobile ? [{ type: 'pointerDown', button: 0 }] : []),
            { type: 'pause', duration: 180 },
            { type: 'pointerMove', origin: 'viewport', x: startX + 18, y: startY - 8, duration: 160 },
            { type: 'pointerMove', origin: 'viewport', x: startX + 38, y: startY + 6, duration: 160 },
            { type: 'pause', duration: 220 },
            ...(mobile ? [{ type: 'pointerUp', button: 0 }] : []),
          ],
        },
      ],
    });
    await sleep(1900);

    const result = await execute(
      sessionId,
      `
        const canvas = document.querySelector('.ascii-hero canvas');
        return {
          ...window.__asciiFrames,
          errors: window.__asciiErrors,
          canvas: { width: canvas.width, height: canvas.height },
          viewport: { width: innerWidth, height: innerHeight },
        };
      `,
    );
    await screenshot(sessionId, screenshotPath);
    return result;
  } finally {
    await request(`/session/${sessionId}`, undefined, 'DELETE').catch(() => undefined);
  }
}

try {
  await waitForDriver();
  const mobile = await verifyViewport({
    mobile: true,
    screenshotPath: '/tmp/ascii-greeting-mobile.png',
  });
  const desktop = await verifyViewport({
    mobile: false,
    screenshotPath: '/tmp/ascii-greeting-desktop.png',
  });
  const farMobileBands = mobile.maxChanged.slice(2);
  if (farMobileBands.some((changed) => changed <= 3)) {
    throw new Error(`mobile motion did not reach every far band: ${JSON.stringify(mobile)}`);
  }
  if (mobile.firstChangedAt[4] <= mobile.firstChangedAt[0] + 50) {
    throw new Error(`mobile far side changed like a simultaneous blast: ${JSON.stringify(mobile)}`);
  }
  const peakMobileChange = mobile.maxChanged.reduce((total, value) => total + value, 0);
  const finalMobileChange = mobile.finalChanged.reduce((total, value) => total + value, 0);
  if (finalMobileChange >= peakMobileChange * 0.2) {
    throw new Error(`mobile morph did not decay after release: ${JSON.stringify(mobile)}`);
  }
  if (mobile.errors.length > 0 || desktop.errors.length > 0) {
    throw new Error(`page errors: ${JSON.stringify({ mobile: mobile.errors, desktop: desktop.errors })}`);
  }
  console.log(JSON.stringify({ mobile, desktop }, null, 2));
} finally {
  driver.kill('SIGTERM');
}
