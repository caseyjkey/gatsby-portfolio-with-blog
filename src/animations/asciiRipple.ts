export type RippleSource = {
  x: number;
  y: number;
  bornAt: number;
};

export type RippleField = {
  x: number;
  y: number;
  strength: number;
};

export const ASCII_RIPPLE_SPEED = 560;
export const ASCII_RIPPLE_LIFETIME_MS = 1350;
export const ASCII_RIPPLE_WIDTH = 78;

/**
 * Sample the traveling wave field at any glyph. Every live wavefront contributes
 * radial and tangential impulse, allowing a cursor/touch trail to influence the
 * whole word as each source's ring expands and fades.
 */
export function sampleAsciiRippleField(
  x: number,
  y: number,
  sources: readonly RippleSource[],
  now: number,
): RippleField {
  let fieldX = 0;
  let fieldY = 0;
  let activeSources = 0;

  for (const source of sources) {
    const ageMs = now - source.bornAt;
    if (ageMs < 0 || ageMs > ASCII_RIPPLE_LIFETIME_MS) continue;

    const dx = x - source.x;
    const dy = y - source.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.01) continue;

    const waveRadius = (ASCII_RIPPLE_SPEED * ageMs) / 1000;
    const band = (distance - waveRadius) / ASCII_RIPPLE_WIDTH;
    const distanceFade = Math.exp(-distance / 680);
    const ageFade = Math.exp(-ageMs / 900);
    // A long, smooth carrier keeps the whole word moving while the leading
    // wavefront travels outward; it is not a narrow ring that only touches
    // the glyphs immediately beside the pointer.
    const carrier = 0.28 + 0.72 * Math.sin((distance - waveRadius) / 82);
    const weight = carrier * Math.exp(-0.5 * band * band) * distanceFade * ageFade;
    if (weight < 0.012) continue;

    activeSources += 1;
    const radialX = dx / distance;
    const radialY = dy / distance;
    const swirl = 0.58;
    fieldX += (radialX - radialY * swirl) * weight;
    fieldY += (radialY + radialX * swirl) * weight;
  }

  // Overlapping trail rings blend rather than exploding the force where many
  // pointer samples overlap.
  const normalization = 1 / Math.sqrt(Math.max(1, activeSources));
  fieldX *= normalization;
  fieldY *= normalization;
  return { x: fieldX, y: fieldY, strength: Math.hypot(fieldX, fieldY) };
}
