import { describe, expect, it } from 'vitest';
import { BELTS, BELT_TOP, BOX_SIZE, parcelPosition, robotPosition } from '../components/logistics-layout';

describe('Logistics world-space constraints', () => {
  it('keeps parcel bottoms on the roller surface for the full cycle', () => {
    for (let lane = 0; lane < BELTS.length; lane++) for (let i = 0; i <= 1000; i++) {
      const p = parcelPosition(lane, i / 1000), belt = BELTS[lane]!;
      expect(p.y - BOX_SIZE / 2).toBeCloseTo(BELT_TOP);
      expect(Math.abs(p.x - belt.x) + BOX_SIZE / 2).toBeLessThan(.525);
      expect(p.z).toBeGreaterThanOrEqual(belt.start);
      expect(p.z).toBeLessThanOrEqual(belt.end);
    }
  });
  it('keeps the entire AGV footprint outside conveyor lanes and racks', () => {
    for (let t = 0; t <= 48; t += .05) {
      const p = robotPosition(t);
      expect(p.y).toBe(0);
      expect(p.x - .575).toBeGreaterThan(-5.9);
      for (const belt of BELTS) expect(Math.abs(p.x - belt.x)).toBeGreaterThan(.575 + .63);
    }
  });
});
