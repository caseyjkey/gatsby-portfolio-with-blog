import { useEffect, useState } from 'react';
import {
  genericRegionalProfile,
  getRegionalProfileById,
  selectRegionalProfile,
  type RegionalProfile,
} from '../data/regionalProfiles';
import { resolveVisitorLocation } from '../lib/visitorLocation';
import {
  REGIONAL_PROFILE_SELECTION_EVENT,
} from '../lib/regionalProfileSelection';

function getPreviewProfile() {
  if (typeof window === 'undefined') return null;
  const requested = new URLSearchParams(window.location.search).get('region');
  if (!requested) return null;
  return getRegionalProfileById(requested);
}

export function useRegionalProfile() {
  const [profile, setProfile] = useState<RegionalProfile>(genericRegionalProfile);

  useEffect(() => {
    let manuallySelected = false;
    const handleSelection = (event: Event) => {
      manuallySelected = true;
      const id = (event as CustomEvent<string>).detail;
      setProfile(getRegionalProfileById(id));
    };
    window.addEventListener(REGIONAL_PROFILE_SELECTION_EVENT, handleSelection);

    const preview = getPreviewProfile();
    if (preview) {
      setProfile(preview);
      return () => {
        window.removeEventListener(REGIONAL_PROFILE_SELECTION_EVENT, handleSelection);
      };
    }

    let cancelled = false;
    void resolveVisitorLocation().then((location) => {
      if (!cancelled && !manuallySelected) {
        setProfile(selectRegionalProfile(
          location?.latitude,
          location?.longitude,
          location?.regionCode,
        ));
      }
    });
    return () => {
      cancelled = true;
      window.removeEventListener(REGIONAL_PROFILE_SELECTION_EVENT, handleSelection);
    };
  }, []);

  return profile;
}

export const __test__ = { getPreviewProfile };
