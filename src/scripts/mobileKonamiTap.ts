export const MOBILE_HOME_HEADER_TAP_COUNT = 5;
export const MOBILE_HOME_HEADER_TAP_WINDOW_MS = 2400;
export const MOBILE_HOME_MAX_WIDTH = 767.98;
export const TOP_OF_PAGE_THRESHOLD = 2;

export type HeaderTapState = {
  count: number;
  lastTapAt: number;
};

export function canUseMobileHomeHeaderCode(
  pathname: string,
  viewportWidth: number,
  scrollY: number,
): boolean {
  return (
    (pathname === '/' || pathname === '/index.html') &&
    viewportWidth <= MOBILE_HOME_MAX_WIDTH &&
    scrollY <= TOP_OF_PAGE_THRESHOLD
  );
}

export function registerMobileHomeHeaderTap(
  state: HeaderTapState,
  now: number,
  eligible: boolean,
): { state: HeaderTapState; activated: boolean } {
  if (!eligible || now - state.lastTapAt > MOBILE_HOME_HEADER_TAP_WINDOW_MS) {
    return eligible
      ? { state: { count: 1, lastTapAt: now }, activated: false }
      : { state: { count: 0, lastTapAt: 0 }, activated: false };
  }

  const count = state.count + 1;
  if (count >= MOBILE_HOME_HEADER_TAP_COUNT) {
    return { state: { count: 0, lastTapAt: 0 }, activated: true };
  }

  return { state: { count, lastTapAt: now }, activated: false };
}
