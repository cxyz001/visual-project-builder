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
