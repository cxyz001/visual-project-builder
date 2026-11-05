export const BELT_TOP = 1.16;
export const BOX_SIZE = .62;
export const BELTS = [{ x: -1.8, start: -5, end: 6 }, { x: .4, start: -5, end: 6 }] as const;
export function parcelPosition(lane: number, progress: number) {
  const belt = BELTS[lane]!;
  return { x: belt.x, y: BELT_TOP + BOX_SIZE / 2, z: belt.start + BOX_SIZE / 2 + (belt.end - belt.start - BOX_SIZE) * progress };
}
export function robotPosition(time: number) {
  const phase = (time % 24) / 24;
  const t = phase < .5 ? phase * 2 : (1 - phase) * 2;
  return { x: -4.1, y: 0, z: -4 + 9 * t, heading: phase < .5 ? 0 : Math.PI };
}
export function truckPosition(time: number) {
  const p = (time % 32) / 32;
  const t = p < .15 ? 0 : p < .48 ? (p - .15) / .33 : p < .62 ? 1 : p < .95 ? 1 - (p - .62) / .33 : 0;
  return -3 + 7 * t * t * (3 - 2 * t);
}

/** Real truck manoeuvre (as in the reference video): pull straight out of the dock,
 * steer through a quarter turn onto the yard road, leave, then reverse back along the
 * same path into the dock. Trucks take turns: each owns half of a 40 s cycle. */
export const TRUCK_CYCLE = 40;
const DOCK_Z = -3, STRAIGHT = 6, RADIUS = 5, EXIT = 16;
const ARC = RADIUS * Math.PI / 2, PATH = STRAIGHT + ARC + EXIT;
const ease = (t: number) => t * t * (3 - 2 * t);
function along(x0: number, s: number) {
  if (s <= STRAIGHT) return { x: x0, z: DOCK_Z + s, heading: 0, curve: 0 };
  if (s <= STRAIGHT + ARC) {
    const a = (s - STRAIGHT) / RADIUS;
    return { x: x0 + RADIUS - RADIUS * Math.cos(a), z: DOCK_Z + STRAIGHT + RADIUS * Math.sin(a), heading: a, curve: 1 };
  }
  return { x: x0 + RADIUS + (s - STRAIGHT - ARC), z: DOCK_Z + STRAIGHT + RADIUS, heading: Math.PI / 2, curve: 0 };
}
export function truckPose(x0: number, time: number, slot: number) {
  const p = (((time - slot * TRUCK_CYCLE / 2) % TRUCK_CYCLE) + TRUCK_CYCLE) % TRUCK_CYCLE / (TRUCK_CYCLE / 2);
  let s = 0;
  if (p >= 1) s = 0;
  else if (p < .06) s = 0;
  else if (p < .42) s = PATH * ease((p - .06) / .36) ** 1.4;
  else if (p < .52) s = PATH;
  else if (p < .94) s = PATH * (1 - ease((p - .52) / .42));
  return { ...along(x0, s), s };
}
