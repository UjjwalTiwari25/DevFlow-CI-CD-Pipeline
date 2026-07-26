import { useCallback, useEffect, useState } from 'react';
import appConstants from '@/utils/constants/app';
import Branch from '@/services/Branch';
import { getCoachName } from '@/models/coach';
import useShallowEqualSelector from './shallowEqualSelector';
import Logger from '../services/Logger';
import useAuthUser from './authUser';
import useTranslations from './translations';

export default function useCourseDeeplink({ course, courseCoach }) {
  const { user } = useAuthUser();
  const [deeplink, setDeepLink] = useState(null);
  const { id: courseId, name, image } = course;
  const { id: userId, givenName, provider } = user || {};
  const { currentLocale } = useTranslations();
  const { referrer, utm: { utm_campaign, utm_source } = {} } =
    useShallowEqualSelector((payment) => payment);

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
      feature: 'course',
      data: {
        userId,
        courseId,
        courseName: name,
        courseImage: image,
        courseOwnerId: courseCoach?.id,
        courseOwnerName: getCoachName(courseCoach),
        userName: givenName,
        source: utm_source || 'course',
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
  }, [currentLocale, userId, courseId, givenName, provider, name, image]);

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
    if (user) {
      generateDeepLink();
    }
  }, [generateBranchLink, user]);

  return {
    deeplink,
  };
}
