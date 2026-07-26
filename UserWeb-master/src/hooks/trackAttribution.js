import Router from 'next/router';
import { useEffect } from 'react';
import Analytics from '../services/Analytics';
import LocalStorage from '../services/LocalStorage';
import routeConstants from '../utils/constants/routes';
import useAuthUser from './authUser';
import usePageQuery from './pageQuery';

function isValidUTM(utmParam) {
  return utmParam && utmParam.length && utmParam !== 'null';
}

export const TRACKED_PARAMS = {
  a_aid: LocalStorage.KEYS.USER_INSTALL_AFFILIATE_ID,
  celeb_id: LocalStorage.KEYS.USER_INSTALL_CELEBRITY_ID,
  utm_adset_name: LocalStorage.KEYS.USER_INSTALL_ADSET_NAME,
  utm_source: LocalStorage.KEYS.USER_INSTALL_SOURCE,
  utm_campaign: LocalStorage.KEYS.USER_INSTALL_CAMPAIGN,
  utm_medium: LocalStorage.KEYS.USER_INSTALL_MEDIUM,
  utm_content: LocalStorage.KEYS.USER_INSTALL_CONTENT,
  utm_campaign_id: LocalStorage.KEYS.USER_INSTALL_CAMPAIGN_ID,
  utm_adset_id: LocalStorage.KEYS.USER_INSTALL_ADSET_ID,
  utm_ad_id: LocalStorage.KEYS.USER_INSTALL_AD_ID,
  utm_site_source_name: LocalStorage.KEYS.USER_INSTALL_SITE_SOURCE,
  utm_campaign_name: LocalStorage.KEYS.USER_INSTALL_CAMPAIGN_NAME,
  utm_language: LocalStorage.KEYS.USER_INSTALL_LANGUAGE,
  utm_term: LocalStorage.KEYS.USER_INSTALL_TERM,
};

const TRACKED_PROPERTY_NAMES = {
  a_aid: 'Attribution Affiliate ID',
  celeb_id: 'Attribution Celebrity ID',
  utm_adset_name: 'Attribution Ad Set Name',
  utm_source: 'Attribution Install Source',
  utm_campaign: 'Attribution Campaign',
  utm_medium: 'Attribution Medium',
  utm_content: 'Attribution Content',
  utm_campaign_id: 'Attribution Campaign ID',
  utm_adset_id: 'Attribution Ad Set ID',
  utm_ad_id: 'Attribution Ad ID',
  utm_site_source_name: 'Attribution Site Source Name',
  utm_campaign_name: 'Attribution Campaign Name',
  utm_language: 'Attribution Language',
  utm_term: 'Attribution Keyword',
};

export const FIREBASE_ATTRIBUTION_PROPERTIES = {
  a_aid: 'affiliateId',
  celeb_id: 'celebrityId',
  utm_adset_name: 'adsetName',
  utm_source: 'installSource',
  utm_campaign: 'campaign',
  utm_medium: 'medium',
  utm_content: 'content',
  utm_campaign_id: 'campaignId', // fbCampaignId
  utm_adset_id: 'adsetId', // fbAdSetId
  utm_ad_id: 'adId', // fbInternalAdId
  utm_site_source_name: 'siteSourceName',
  utm_campaign_name: 'campaignName',
  utm_language: 'language',
  utm_term: 'term',
};

const {
  PAGE_SIGNUP,
  PAGE_CELEBRITIES,
  SLUG_CELEBRITY,
  PAGE_COACHES,
  PAGE_COMMUNITIES,
  PAGE_COURSES,
  PAGE_EVENTS,
  PAGE_REFER,
  SLUG_REFERRAL_CODE,
  PAGE_CHALLENGES,
  PAGE_LIVE,
  PAGE_GUEST_PASS,
  PAGE_TRACKS,
  SLUG_COACH,
  SLUG_COMMUNITY,
  SLUG_COURSE,
  SLUG_EVENT,
  SLUG_TRACK_ID,
  SLUG_CHALLENGE_ID,
  SLUG_LIVE_ID,
} = routeConstants;

const SAVE_TO_MIXPANEL_ROUTES = [
  `/${PAGE_SIGNUP}`,
  `/${PAGE_CELEBRITIES}/${SLUG_CELEBRITY}`,
  `/${PAGE_REFER}/${SLUG_REFERRAL_CODE}/${PAGE_CHALLENGES}/${SLUG_CHALLENGE_ID}`,
  `/${PAGE_REFER}/${SLUG_REFERRAL_CODE}/${PAGE_LIVE}/${SLUG_LIVE_ID}`,
  `/${PAGE_REFER}/${SLUG_REFERRAL_CODE}/${PAGE_TRACKS}/${SLUG_TRACK_ID}`,
  `/${PAGE_REFER}/${SLUG_REFERRAL_CODE}/${PAGE_GUEST_PASS}`,
  `/${PAGE_COACHES}/${SLUG_COACH}/${PAGE_COMMUNITIES}/${SLUG_COMMUNITY}`,
  `/${PAGE_COACHES}/${SLUG_COACH}/${PAGE_COURSES}/${SLUG_COURSE}`,
  `/${PAGE_COACHES}/${SLUG_COACH}/${PAGE_EVENTS}/${SLUG_EVENT}`,
];

export function getAttributionDataFromUTMs(pageQuery) {
  const attributionData = {};
  Object.keys(TRACKED_PARAMS).forEach((utmKey) => {
    const utmParam = pageQuery[utmKey] || null;
    const analyticsProperty = TRACKED_PROPERTY_NAMES[utmKey];
    const propertyValue =
      LocalStorage.getItem(TRACKED_PARAMS[utmKey]) || utmParam;
    attributionData[analyticsProperty] = propertyValue;
  });
  return attributionData;
}

/**
 * React Hook to store last touch attribution params
 */
function useTrackAttribution() {
  const pageQuery = usePageQuery();
  const { user, isLoading, authLoading, error } = useAuthUser();
  useEffect(() => {
    Object.keys(TRACKED_PARAMS).forEach((utmKey) => {
      const utmParam = pageQuery[utmKey] || null;
      if (isValidUTM(utmParam)) {
        if (!(user || authLoading || isLoading || error)) {
          LocalStorage.setItem(TRACKED_PARAMS[utmKey], utmParam);
        }
      }
      // Save to Mixpanel only if user is on signup page
      if (SAVE_TO_MIXPANEL_ROUTES.includes(Router.pathname)) {
        if (!(user || authLoading || isLoading || error)) {
          const analyticsProperty = TRACKED_PROPERTY_NAMES[utmKey];
          const propertyValue =
            LocalStorage.getItem(TRACKED_PARAMS[utmKey]) || utmParam;
          Analytics.setPeopleProperties({
            [analyticsProperty]: propertyValue,
          });
          Analytics.setSuperProperties({
            [analyticsProperty]: propertyValue,
          });
        }
      }
    });
  }, [pageQuery, user, error, isLoading, authLoading]);

  // Store google cookies from utm params
  const { gclid, gbraid, wbraid } = pageQuery;
  useEffect(() => {
    Analytics.setGoogleCookies({ gclid, gbraid, wbraid });
  }, [gclid, gbraid, wbraid]);
}

export default useTrackAttribution;
