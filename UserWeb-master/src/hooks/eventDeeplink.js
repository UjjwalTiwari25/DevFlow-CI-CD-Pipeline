import { useCallback, useEffect, useState } from 'react';
import appConstants from '@/utils/constants/app';
import Branch from '@/services/Branch';
import { getCoachName } from '@/models/coach';
import useShallowEqualSelector from './shallowEqualSelector';
import Logger from '../services/Logger';
import useAuthUser from './authUser';
import useTranslations from './translations';

export default function useEventDeeplink({ event, eventCoach }) {
  const { user } = useAuthUser();
  const [deeplink, setDeepLink] = useState(null);
  const { id: eventId, title, image } = event;
  const { id: userId, givenName, provider } = user || {};
  const { currentLocale } = useTranslations();
  const { referrer, utm: { utm_campaign, utm_source } = {} } =
    useShallowEqualSelector((payment) => payment);

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
      feature: 'event',
      data: {
        userId,
        eventId,
        eventName: title,
        eventImage: image,
        eventOwnerId: eventCoach?.id,
        eventOwnerName: getCoachName(eventCoach),
        userName: givenName,
        source: utm_source || 'event',
        campaign: utm_campaign,
        locale: currentLocale,
        loginProvider: provider,
      },
    };
    if (referrer) {
      linkData.data.referrerName = referrer.givenName;
      linkData.data.referrerId = referrer.id;
    }
    return linkData;
  }, [currentLocale, userId, eventId, givenName, provider, title, image]);

  const generateBranchLink = useCallback(() => {
    const linkData = getLinkData();
    return new Promise((resolve, reject) => {
      Branch.instance().link(linkData, (linkError, branchLink) => {
        if (linkError) {
          Logger.error('Failed to generate link', { linkError });
          reject();
        }
        resolve(branchLink);
      });
    });
  }, [getLinkData]);

  useEffect(() => {
    async function generateDeepLink() {
      const mobileDeepLink = await generateBranchLink();
      setDeepLink(mobileDeepLink);
    }
    generateDeepLink();
  }, [generateBranchLink, user]);

  return {
    deeplink,
  };
}
