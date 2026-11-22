export type MorphPoint = {
  x: number;
  y: number;
};

export type MorphMote = {
  age?: number;
  pointIndex: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

export type MorphLink = readonly [number, number];

export type MorphActivationZone = {
  radius: number;
  x: number;
  y: number;
};

const LINK_RADIUS_MULTIPLIER = 4.5;
const ROW_BRIDGE_MULTIPLIER = 11;
const ROW_SKIP_MULTIPLIER = 8;
const MAX_NEIGHBORS = 3;
const COUPLING_STRENGTH = 0.14;
const VELOCITY_COUPLING = 0.045;
const SPRING_STRENGTH = 0.04;
const DAMPING = 0.82;
const ACTIVATION_IMPULSE = 0.001;
const SETTLE_DISTANCE = 0.32;
const SETTLE_SPEED = 0.18;
const PROPAGATION_BANDS = 5;
const MIN_ACTIVE_STEPS = 5;

/**
 * Connect each sampled glyph to a small set of nearby glyphs. The links let a
 * touched glyph pull a short ring of neighbors; stepMobileNeighborMorph's
 * activation zone keeps that elastic response around the fingertip.
 */
export function buildMobileMorphLinks(
  points: readonly MorphPoint[],
  sampleStep: number,
): MorphLink[] {
  const linkRadius = sampleStep * LINK_RADIUS_MULTIPLIER;
  const cellSize = linkRadius;
  const buckets = new Map<string, number[]>();
  const keyFor = (x: number, y: number) =>
    `${Math.floor(x / cellSize)}:${Math.floor(y / cellSize)}`;

  points.forEach((point, pointIndex) => {
    const key = keyFor(point.x, point.y);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(pointIndex);
    else buckets.set(key, [pointIndex]);
  });

  const links = new Set<string>();

  // The opaque samples form separate islands for each letter. Bridge adjacent
  // islands along each sample row so a tug near a letter edge can yield the
  // next letter inside the activation zone; the spatial cap prevents a bridge
  // chain from spreading the response across the whole word.
  const rows = new Map<number, number[]>();
  points.forEach((point, pointIndex) => {
    const row = Math.round(point.y / sampleStep);
    const rowPoints = rows.get(row);
    if (rowPoints) rowPoints.push(pointIndex);
    else rows.set(row, [pointIndex]);
  });
  for (const rowPoints of rows.values()) {
    rowPoints.sort((first, second) => points[first].x - points[second].x);
    for (let index = 1; index < rowPoints.length; index += 1) {
      const first = rowPoints[index - 1];
      const second = rowPoints[index];
      if (points[second].x - points[first].x <= sampleStep * ROW_BRIDGE_MULTIPLIER) {
        links.add(`${Math.min(first, second)}:${Math.max(first, second)}`);
      }
    }
    // Add one farther elastic neighbor per point. These are still real glyph
    // relationships, but they stop a dense stroke from diffusing all of its
    // energy before the visible morph reaches the next letter.
    for (let index = 0; index < rowPoints.length; index += 1) {
      const first = rowPoints[index];
      const targetX = points[first].x + sampleStep * ROW_SKIP_MULTIPLIER;
      const second = rowPoints.slice(index + 1).find(
        (candidate) => points[candidate].x >= targetX,
      );
      if (second !== undefined && points[second].x - points[first].x <= sampleStep * ROW_BRIDGE_MULTIPLIER) {
        links.add(`${Math.min(first, second)}:${Math.max(first, second)}`);
      }
    }
  }

  points.forEach((point, pointIndex) => {
    const cellX = Math.floor(point.x / cellSize);
    const cellY = Math.floor(point.y / cellSize);
    const nearby: Array<{ pointIndex: number; distance: number }> = [];

    for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
      for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
        const bucket = buckets.get(`${cellX + xOffset}:${cellY + yOffset}`) ?? [];
        for (const candidateIndex of bucket) {
          if (candidateIndex === pointIndex) continue;
          const candidate = points[candidateIndex];
          const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
          if (distance <= linkRadius) nearby.push({ pointIndex: candidateIndex, distance });
        }
      }
    }

    nearby
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_NEIGHBORS)
      .forEach(({ pointIndex: candidateIndex }) => {
        const first = Math.min(pointIndex, candidateIndex);
        const second = Math.max(pointIndex, candidateIndex);
        links.add(`${first}:${second}`);
      });
  });

  return [...links].map((link) => {
    const [first, second] = link.split(':').map(Number);
    return [first, second] as const;
  });
}

/** Advance the active part of the spring mesh by one animation step. */
export function stepMobileNeighborMorph(
  points: readonly MorphPoint[],
  links: readonly MorphLink[],
  motes: readonly MorphMote[],
  maxActive: number,
  activationZone?: MorphActivationZone,
): MorphMote[] {
  if (motes.length === 0) return [];

  const active = new Map(motes.map((mote) => [mote.pointIndex, { ...mote }]));
  const impulses = new Map<number, { x: number; y: number }>();
  const addImpulse = (pointIndex: number, x: number, y: number) => {
    const impulse = impulses.get(pointIndex);
    if (impulse) {
      impulse.x += x;
      impulse.y += y;
    } else {
      impulses.set(pointIndex, { x, y });
    }
  };

  for (const [firstIndex, secondIndex] of links) {
    const firstMote = active.get(firstIndex);
    const secondMote = active.get(secondIndex);
    if (!firstMote && !secondMote) continue;

    const firstHome = points[firstIndex];
    const secondHome = points[secondIndex];
    const firstDx = firstMote ? firstMote.x - firstHome.x : 0;
    const firstDy = firstMote ? firstMote.y - firstHome.y : 0;
    const secondDx = secondMote ? secondMote.x - secondHome.x : 0;
    const secondDy = secondMote ? secondMote.y - secondHome.y : 0;
    const firstVx = firstMote?.vx ?? 0;
    const firstVy = firstMote?.vy ?? 0;
    const secondVx = secondMote?.vx ?? 0;
    const secondVy = secondMote?.vy ?? 0;
    const impulseX =
      (firstDx - secondDx) * COUPLING_STRENGTH +
      (firstVx - secondVx) * VELOCITY_COUPLING;
    const impulseY =
      (firstDy - secondDy) * COUPLING_STRENGTH +
      (firstVy - secondVy) * VELOCITY_COUPLING;

    addImpulse(firstIndex, -impulseX, -impulseY);
    addImpulse(secondIndex, impulseX, impulseY);
  }

  const room = Math.max(0, maxActive - active.size);
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const fieldWidth = Math.max(1, maxX - minX);
  const bandFor = (pointIndex: number) =>
    Math.min(
      PROPAGATION_BANDS - 1,
      Math.floor(((points[pointIndex].x - minX) / fieldWidth) * PROPAGATION_BANDS),
    );
  const perBandLimit = Math.ceil(maxActive / PROPAGATION_BANDS);
  const bandCounts = Array(PROPAGATION_BANDS).fill(0);
  for (const pointIndex of active.keys()) bandCounts[bandFor(pointIndex)] += 1;
  let added = 0;
  [...impulses.entries()]
    .filter(([pointIndex, impulse]) =>
      !active.has(pointIndex) &&
      Math.hypot(impulse.x, impulse.y) >= ACTIVATION_IMPULSE &&
      (!activationZone ||
        Math.hypot(
          points[pointIndex].x - activationZone.x,
          points[pointIndex].y - activationZone.y,
        ) <= activationZone.radius)
    )
    .sort(([, first], [, second]) =>
      Math.hypot(second.x, second.y) - Math.hypot(first.x, first.y)
    )
    .forEach(([pointIndex]) => {
      if (added >= room) return;
      const band = bandFor(pointIndex);
      if (bandCounts[band] >= perBandLimit) return;
      const home = points[pointIndex];
      active.set(pointIndex, {
        age: 0,
        pointIndex,
        x: home.x,
        y: home.y,
        vx: 0,
        vy: 0,
      });
      bandCounts[band] += 1;
      added += 1;
    });

  const next: MorphMote[] = [];
  for (const mote of active.values()) {
    const home = points[mote.pointIndex];
    const impulse = impulses.get(mote.pointIndex);
    if (impulse) {
      mote.vx += impulse.x;
      mote.vy += impulse.y;
    }
    mote.vx += (home.x - mote.x) * SPRING_STRENGTH;
    mote.vy += (home.y - mote.y) * SPRING_STRENGTH;
    mote.vx *= DAMPING;
    mote.vy *= DAMPING;
    mote.x += mote.vx;
    mote.y += mote.vy;
    mote.age = (mote.age ?? 0) + 1;

    const settled =
      mote.age >= MIN_ACTIVE_STEPS &&
      Math.abs(home.x - mote.x) < SETTLE_DISTANCE &&
      Math.abs(home.y - mote.y) < SETTLE_DISTANCE &&
      Math.abs(mote.vx) < SETTLE_SPEED &&
      Math.abs(mote.vy) < SETTLE_SPEED;
    if (!settled) next.push(mote);
  }

  const fieldSettled = next.length > 0 && next.every((mote) => {
    const home = points[mote.pointIndex];
    return (
      Math.abs(home.x - mote.x) < SETTLE_DISTANCE &&
      Math.abs(home.y - mote.y) < SETTLE_DISTANCE &&
      Math.abs(mote.vx) < SETTLE_SPEED &&
      Math.abs(mote.vy) < SETTLE_SPEED
    );
  });
  if (fieldSettled) return [];

  return next;
}
