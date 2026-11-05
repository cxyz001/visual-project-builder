import { describe, expect, it } from 'vitest';
import { truckPose, TRUCK_CYCLE } from '../components/logistics-layout';
describe('truck manoeuvre', () => {
  it('starts and ends parked at the dock, facing out', () => {
    expect(truckPose(5, 0, 0)).toMatchObject({ x: 5, z: -3, heading: 0 });
    expect(truckPose(5, TRUCK_CYCLE * .49, 0).s).toBe(0);
  });
  it('moves continuously without jumps', () => {
    for (let t = 0; t < TRUCK_CYCLE * 2; t += .02) {
      const a = truckPose(5, t, 0), b = truckPose(5, t + .02, 0);
      expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeLessThan(.15);
    }
  });
  it('never moves both trucks at once', () => {
    for (let t = 0; t < TRUCK_CYCLE; t += .1) expect(truckPose(5, t, 0).s > 0 && truckPose(9.5, t, 1).s > 0).toBe(false);
  });
});
