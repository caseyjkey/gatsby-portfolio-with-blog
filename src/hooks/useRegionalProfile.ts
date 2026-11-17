import { useEffect, useState } from 'react';
import {
  genericRegionalProfile,
  getRegionalProfileById,
  selectRegionalProfile,
  type RegionalProfile,
} from '../data/regionalProfiles';
import { resolveVisitorLocation } from '../lib/visitorLocation';

function getPreviewProfile() {
  if (typeof window === 'undefined') return null;
  const requested = new URLSearchParams(window.location.search).get('region');
  if (!requested) return null;
  return getRegionalProfileById(requested);
}

export function useRegionalProfile() {
  const [profile, setProfile] = useState<RegionalProfile>(genericRegionalProfile);

  useEffect(() => {
    const preview = getPreviewProfile();
    if (preview) {
      setProfile(preview);
      return undefined;
    }

    let cancelled = false;
    void resolveVisitorLocation().then((location) => {
      if (!cancelled) {
        setProfile(selectRegionalProfile(
          location?.latitude,
          location?.longitude,
          location?.regionCode,
        ));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return profile;
}

export const __test__ = { getPreviewProfile };
