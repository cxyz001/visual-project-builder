import { describe, expect, it } from 'vitest';
import { BELTS, BELT_TOP, BOX_SIZE, parcelPosition, robotPosition, truckPosition } from '../components/logistics-layout';

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
  it('moves trucks continuously and holds at both ends of their lanes', () => {
    expect(truckPosition(0)).toBe(truckPosition(3));
    expect(truckPosition(16)).toBe(truckPosition(19));
    for (let t = 0; t < 64; t += .05) {
      expect(truckPosition(t)).toBeGreaterThanOrEqual(-3);
      expect(truckPosition(t)).toBeLessThanOrEqual(4);
      expect(Math.abs(truckPosition(t + .05) - truckPosition(t))).toBeLessThan(.06);
    }
  });
});
