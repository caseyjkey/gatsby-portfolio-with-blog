import { describe, expect, test } from 'bun:test';
import {
  canUseMobileHomeHeaderCode,
  registerMobileHomeHeaderTap,
  type HeaderTapState,
} from './mobileKonamiTap';

describe('mobile home header Konami shortcut', () => {
  test('is limited to mobile at the top of the home page', () => {
    expect(canUseMobileHomeHeaderCode('/', 390, 0)).toBe(true);
    expect(canUseMobileHomeHeaderCode('/index.html', 390, 1)).toBe(true);
    expect(canUseMobileHomeHeaderCode('/', 390, 4)).toBe(false);
    expect(canUseMobileHomeHeaderCode('/projects', 390, 0)).toBe(false);
    expect(canUseMobileHomeHeaderCode('/', 1024, 0)).toBe(false);
  });

  test('activates exactly on the fifth tap inside the tap window', () => {
    let state: HeaderTapState = { count: 0, lastTapAt: 0 };
    for (let tap = 0; tap < 4; tap += 1) {
      const result = registerMobileHomeHeaderTap(state, tap * 180, true);
      expect(result.activated).toBe(false);
      state = result.state;
    }
    const fifth = registerMobileHomeHeaderTap(state, 720, true);
    expect(fifth.activated).toBe(true);
    expect(fifth.state.count).toBe(0);
  });

  test('resets after an ineligible tap or an expired tap window', () => {
    const ineligible = registerMobileHomeHeaderTap({ count: 3, lastTapAt: 500 }, 600, false);
    expect(ineligible).toEqual({ state: { count: 0, lastTapAt: 0 }, activated: false });

    const expired = registerMobileHomeHeaderTap({ count: 3, lastTapAt: 500 }, 2901, true);
    expect(expired).toEqual({ state: { count: 1, lastTapAt: 2901 }, activated: false });
  });
});
