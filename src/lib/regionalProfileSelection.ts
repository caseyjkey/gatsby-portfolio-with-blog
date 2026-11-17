import type { RegionalProfileId } from '../data/regionalProfiles';

export const REGIONAL_PROFILE_SELECTION_EVENT = 'portfolio-regional-profile-selection';

export function selectRegionalProfileForSession(id: RegionalProfileId): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent<RegionalProfileId>(REGIONAL_PROFILE_SELECTION_EVENT, {
    detail: id,
  }));
}
