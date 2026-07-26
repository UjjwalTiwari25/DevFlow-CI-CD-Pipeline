import { useEffect, useState } from 'react';
import {
  getAvailableCoachingSpots,
  getCoachPackages,
  listCoaches,
} from '../models/coach';

export default function useBookableCoaches(options) {
  const { videoOnly } = options || {};
  const [coaches, setCoaches] = useState(null);

  useEffect(() => {
    async function getCoaches() {
      const res = await listCoaches();
      if (res) {
        let bookableCoaches = res
          .filter((coach) => coach.allowFreeCoachingTrial)
          .filter((coach) => coach.bookable && !!coach.coachingEnabledAt)
          .filter((coach) => getAvailableCoachingSpots(coach) > 0)
          .sort(() => Math.random() - 0.5);
        if (videoOnly) {
          const coachPackageSet = new Set();
          const packages = await getCoachPackages();
          if (packages) {
            packages.forEach((item) => {
              const { coachId, features } = item;
              if (features.some(({ feature }) => feature === 'video')) {
                coachPackageSet.add(coachId);
              }
            });
            bookableCoaches = bookableCoaches.filter((coach) =>
              coachPackageSet.has(coach.id)
            );
          }
        }
        setCoaches(bookableCoaches);
      }
    }
    if (!coaches && options) {
      getCoaches();
    }
  }, [coaches, options, videoOnly]);

  return { coaches };
}
