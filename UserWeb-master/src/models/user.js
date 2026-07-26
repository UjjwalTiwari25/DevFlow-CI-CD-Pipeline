import axios from 'axios';
import Http from '@/services/Http';
import { isValidEmail } from '../utils/validators';
import Logger from '../services/Logger';
import config from '../config';
import appConstants from '../utils/constants/app';
import Analytics from '../services/Analytics';
import RECOMMENDATION_TOPICS from '../data/topics.json';
import Auth from '../services/Auth';
import FirebaseDatabase from '../services/FirebaseDatabase';
import {
  notifyAPIError,
  notifyHandledError,
} from '../services/ErrorMonitoring';

async function getUser(id) {
  let user = null;
  try {
    if (id) {
      Logger.debug(`users: get ${id}`);
      const value = await FirebaseDatabase.getValue(`/users/${id}`);
      if (value !== null) {
        user = {
          id,
          ...value,
        };
      }
    }
  } catch (error) {
    Logger.error('Failed to get user', { error });
    return null;
  }

  return user;
}

// Verify a Firebase session cookie against UserService and return the trusted
// user id (decoded from the cookie's signed claims), or null if missing/invalid.
// Used by the webview paywall so identity comes from the mobile-minted session
// cookie instead of being trusted from the URL. Server-side only (called from
// getServerSideProps). Endpoint: POST /users/verifySessionOrToken -> { id, verified }.
async function verifySessionCookie(session) {
  if (!session) return null;
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/users/verifySessionOrToken`,
      data: { session },
      headers: { 'Content-Type': 'application/json' },
    });
    if (response?.data?.verified === true) {
      return response.data.id || null;
    }
  } catch (error) {
    notifyHandledError(error, { message: 'Failed to verify session cookie' });
  }
  return null;
}

function getUserFirstName(user) {
  return user?.givenName || 'Aura';
}

function getUserPhoto(user) {
  return (
    user?.profilePicture ||
    'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/auraTrackPic.png?alt=media&token=06b53bb7-8f44-4da0-a47a-82d94c030fbb'
  );
}

async function setUser(user, id) {
  Logger.info(`Setting user ${id}`, user);
  const userData = user;
  if (userData.id) {
    delete userData.id;
  }
  let res = null;
  if (userData) {
    res = await FirebaseDatabase.setValue(`users/${id}`, userData);
  }
  return res;
}

async function pollUserExists(userId) {
  const apiRoute = `${config.api.auraServices}/scheduling/users/${userId}`;
  const result = await Http.pollApi(apiRoute);
  return result;
}

async function pollCommunityUserSubscriptionExists(userId, communityId) {
  const authToken = await Auth.getUserAuthToken();
  const apiRoute = `${config.api.auraServices}/communities/subscriptions/${userId}/${communityId}`;
  const result = await Http.pollApi(apiRoute, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return result;
}

async function setUserWithoutAuth(profile) {
  Logger.debug('user: create');
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/users`,
      data: JSON.stringify(profile),
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to create user' });
    return { error };
  }
  return { error: 'Failed to create user' };
}

async function updateUser(user, id) {
  const userData = user;
  if (userData.id) {
    delete userData.id;
  }
  let res = null;
  try {
    if (userData && id) {
      res = await FirebaseDatabase.updateValue(`users/${id}`, userData);
    }
  } catch (error) {
    notifyHandledError(error, { message: 'error updating user' });
    return null;
  }
  return res;
}

function createFirebaseProfile(profile) {
  const user = {
    ...profile,
    createdAt: new Date().toISOString(),
    isAnonymous: false,
    signUpSource: appConstants.APP_NAME,
    attributionData: {
      sourcePlatform: appConstants.APP_NAME,
    },
    gamification: {
      level: 1,
      minutesListened: 0,
      points: 0,
      tokens: 0,
    },
    premium: false,
    emailPermissions: {
      emailPermissionDaily: true,
      emailPermissionWeekly: false,
      emailPermissionNew: true,
      emailPermissionOffer: true,
      emailPermissionSurvey: true,
    },
    timezone: Intl?.DateTimeFormat().resolvedOptions().timeZone || null, // Safety check required for very old browsers that may not support Intl
    pixelCookies: Analytics.getPixelCookies(),
    twitterCookies: Analytics.getTwitterCookies(),
    googleCookies: Analytics.getGoogleCookies(),
  };
  return user;
}

function createUserProfileFromAuth(authData, givenName, attributionData) {
  // The first linked provider isn't guaranteed to carry the email (a provider can be returned
  // without an email scope), so resolve the "primary" provider as the first one that has an
  // email — falling back to the first entry. Mirrors UserService's getAuthUser so web and
  // backend agree on which provider wins, instead of blindly trusting providerData[0].
  const providers =
    authData.providerData && authData.providerData.length
      ? authData.providerData
      : [];
  const providerData =
    providers.find((p) => p && p.email) || providers[0] || null;
  const email = authData.email || providerData?.email || null;
  const provider =
    providerData && providerData.providerId ? providerData.providerId : null;
  const profile = {
    provider,
    email,
    createdAt: new Date().toISOString(),
    timezone: Intl?.DateTimeFormat().resolvedOptions().timeZone || null, // Safety check required for very old browsers that may not support Intl
  };
  function findLastName(name) {
    const n = name.split(` `);
    if (n.length > 1) {
      return n[n.length - 1];
    }
    return null;
  }
  if (authData.displayName) {
    profile.name = authData.displayName;
    const [firstName] = authData.displayName.split(' ');
    profile.givenName = firstName;
  }
  if (providerData) {
    if (providerData.displayName) {
      profile.name = providerData.displayName;
      const [displayName] = providerData.displayName.split(` `);
      profile.givenName = displayName;
      const lastName = findLastName(providerData.displayName);
      if (lastName) {
        profile.familyName = lastName;
      }
    }
    if (providerData.givenName) {
      // does not usually happen
      profile.givenName = providerData.givenName;
    }

    if (providerData.photoURL) {
      profile.profilePicture = providerData.photoURL;
    }
  }
  profile.isAnonymous = authData.isAnonymous;
  // handle saved name
  if (givenName && givenName !== ``) {
    profile.givenName = givenName;
  }
  profile.signUpSource = appConstants.APP_NAME;
  profile.gamification = {
    level: 1,
    minutesListened: 0,
    points: 0,
    tokens: 0,
  };
  profile.attributionData = {
    ...attributionData,
    sourcePlatform: appConstants.APP_NAME,
  };
  profile.emailPermissions = {
    emailPermissionDaily: true,
    emailPermissionWeekly: false,
    emailPermissionNew: true,
    emailPermissionOffer: true,
    emailPermissionSurvey: true,
  };
  profile.pixelCookies = Analytics.getPixelCookies();
  profile.twitterCookies = Analytics.getTwitterCookies();
  profile.googleCookies = Analytics.getGoogleCookies();
  return profile;
}

async function getUserFromEmail(email) {
  let user = null;
  try {
    if (email) {
      Logger.debug('users: getFromEmail');
      if (isValidEmail(email)) {
        const encodedEmail = Buffer.from(email).toString('base64');
        const userEmail = await FirebaseDatabase.getValue(
          `/emailUser/${encodedEmail}`
        );

        if (userEmail && userEmail.userId) {
          user = await getUser(userEmail.userId);
        }
      }
    } else {
      Logger.warn('No email specified');
    }
  } catch (error) {
    Logger.error('Failed to get user from email', { error });
    return null;
  }
  return user;
}

async function getUserFromAuth(auth) {
  let user = null;
  try {
    if (auth) {
      Logger.debug('users: getFromAuth');
      const { uid, email, providerData } = auth;
      // Scan all linked providers for an email rather than assuming providerData[0] carries it.
      const providerWithEmail = (providerData || []).find((p) => p && p.email);
      const emailId = email || providerWithEmail?.email || null;
      if (emailId) {
        user = await getUserFromEmail(emailId);
        if (!user) {
          if (uid) {
            user = await getUser(uid);
          }
        }
      } else if (uid) {
        user = await getUser(uid);
      }
    }
  } catch (error) {
    Logger.error('Failed to get user', { error });
    return null;
  }
  return user;
}

async function getUserFromReferralCode(referralCode) {
  if (
    !referralCode ||
    referralCode === '' ||
    (typeof referralCode === 'string' && referralCode === 'undefined')
  ) {
    return null;
  }
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/referralCodes/getUser/${referralCode}`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.status === 200 && response.data) {
      return {
        ...response.data,
        referralCode,
      };
    }
    return null;
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to get user from referral code' });
    return null;
  }
}

async function getUserReferrals(userId) {
  if (!userId || userId === '') {
    return null;
  }
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/referrals/${userId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.status === 200 && response.data) {
      Logger.debug('user referrals', { referralData: response.data });
      return response.data;
    }
    return null;
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to get user referrals' });
    return null;
  }
}

async function getUserReferralFriends(userId) {
  if (!userId || userId === '') {
    return null;
  }
  try {
    const value = await FirebaseDatabase.getValue(`/referralFriends/${userId}`);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    Logger.error('Failed to get referral friends', { error });
  }
  return null;
}

async function getUserSubscription(userID) {
  if (!userID || userID === '') {
    return null;
  }
  let subscription = null;
  const value = await await FirebaseDatabase.getValue(
    `/userSubscriptions/${userID}`
  );
  if (value !== null) {
    subscription = {
      ...value,
    };
  }
  return subscription;
}

async function confirmEmail(id) {
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/emails/confirm/${id}`,
    };
    const response = await axios(options);
    if (response) {
      return {};
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to confirm user' });
    return { error };
  }
  return { error: 'Failed to confirm user' };
}

async function unsubscribeFromEmails(id) {
  Logger.debug('user: unsubscribe from email');
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/emails/unsubscribe/${id}`,
    };
    const response = await axios(options);
    if (response) {
      return {};
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to unsubscribe from emails' });
    return { error };
  }
  return { error: 'Failed to unsubscribe user' };
}

function getUserContentTypePreference(profile) {
  if (!profile || !profile.contentTypePreference) {
    return null;
  }
  const { contentTypePreference } = profile;
  const userContentTypes = Object.keys(contentTypePreference)
    .map((key) => ({
      key,
      order: contentTypePreference[key],
    }))
    .sort((a, b) => a.order - b.order);
  return userContentTypes.map((types) => types.key);
}

function getPersonalizedFeedTopics(profile) {
  if (!profile || !profile.recommendationPreference) {
    return {};
  }
  const userTopics = Object.keys(profile.recommendationPreference);
  const userTopicsPreference = {};

  userTopics.forEach((key) => {
    if (RECOMMENDATION_TOPICS[key]) {
      userTopicsPreference[key] = RECOMMENDATION_TOPICS[key];
      userTopicsPreference[key].isActive = true;
      userTopicsPreference[key].selectedOrder =
        profile.recommendationPreference[key];
    }
  });

  const preference = {
    ...RECOMMENDATION_TOPICS,
    ...userTopicsPreference,
  };
  let selectedFeed = [];
  let defaultFeed = [];
  Object.values(preference).forEach((item) => {
    if (item.isActive) {
      selectedFeed.push(item);
    } else {
      defaultFeed.push(item);
    }
  });

  // Sort
  defaultFeed = defaultFeed.sort((a, b) => {
    return a.order - b.order;
  });
  selectedFeed = selectedFeed.sort((a, b) => {
    return a.selectedOrder - b.selectedOrder;
  });
  return {
    personalizedActiveFeed: selectedFeed,
    personalizedInactiveFeed: defaultFeed,
  };
}

async function followUser(currentUserId, userIdToFollow) {
  await FirebaseDatabase.setValue(
    `userFollowing/${currentUserId}/${userIdToFollow}`,
    true
  );
  await FirebaseDatabase.setValue(
    `userFollowers/${userIdToFollow}/${currentUserId}`,
    true
  );
  Analytics.track(`Follow`, {
    Time: new Date().toTimeString().slice(0, 2),
    Day: new Date().getDay(),
    Followed: userIdToFollow,
  });
}

function isOrganicUser(user = {}) {
  if (!user.attributionData || !user.attributionData.installSource) return true;
  if (
    typeof user.attributionData.installSource === 'string' &&
    ['', 'null', 'organic'].includes(
      user.attributionData.installSource.toLowerCase()
    )
  ) {
    return true;
  }
  // Set for users who sign up on Aura mobile app
  if (user.attributionData.installType === 'Organic') {
    return true;
  }
  return false;
}

async function sentFamilyPlanInvite({ email, deepLink, givenName, isMale }) {
  const authToken = await Auth.getUserAuthToken();
  const data = {
    recipient: email,
    campaignSlug: 'family-plan-invite',
    templateSlug: 'family-plan-invite',
    substitutionData: {
      family: {
        givenName,
        isMale,
        link: deepLink,
      },
    },
    bypassSubscribed: true,
  };
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/emails`,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to send invite' });
    return { error };
  }
  return { error: 'Failed to send invite' };
}

async function getFamilyPlanInviteList(userId) {
  if (!userId || userId === '') {
    return null;
  }
  try {
    const value = await FirebaseDatabase.getValue(
      `/familyPlanInvites/${userId}`
    );

    if (value !== null) {
      return value;
    }
  } catch (error) {
    Logger.error('Failed to get family plan invitates list', { error });
  }
  return null;
}

async function setFamilyPlanInviteList({ userId, data }) {
  if (!userId || userId === '') {
    return null;
  }
  let res = null;
  if (data) {
    res = await FirebaseDatabase.setValue(`familyPlanInvites/${userId}`, data);
  }
  return res;
}

function isUserContentSubscriber(user) {
  if (!user) return false;
  return user.premium || user.premiumTrial;
}

function isUserCommunitySubscriber(user, communityId) {
  if (!user || !communityId) return false;

  return !!user?.communities?.[communityId];
}

function isUserAlreadyPurchasedCourse(user, courseId) {
  if (!user) return false;

  return !!user?.courses?.[courseId];
}

function isUserAlreadyPurchasedEvent(user, eventId) {
  if (!user) return false;

  return !!user?.events?.[eventId];
}

function isUserCoachingSubscriber(user) {
  if (!user) return false;
  return user.premiumCoaching;
}

async function setUserPhoneNumber(id, data) {
  if (!id || !data) {
    return null;
  }
  let res = null;
  if (id) {
    res = await FirebaseDatabase.setValue(`users/${id}/phone}`, data);
  }
  return res;
}

async function getRecommendationList(name, userProfile = {}) {
  try {
    const data = {
      enrich: false,
      excludeIds: [],
      name,
      limit: 100,
      page: 0,
      targetOnboardingPlatform: 'UserWeb',
      user: userProfile,
    };
    Logger.debug(`Fetching recommendation list: ${name}`, { data });
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/lists/recommend`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      json: true,
    };
    const response = await axios(options);
    Logger.debug('Fetched recommendation list', { response });
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching recommendation list' });
  }
  return null;
}

async function setCalendar({ calendarEmail, calendarType, calendarToken }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/calendars/token`,
      data: {
        calendarEmail,
        calendarType,
        calendarToken,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error setting user calendar' });
    return { error };
  }
  return { error: 'Set User Calendar Failed' };
}

async function getUserByEmail(email) {
  if (!email || email === '') {
    return null;
  }
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/users/email/${email}`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.status === 200 && response.data) {
      return {
        ...response.data,
      };
    }
    return null;
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to get user by email' });
    return null;
  }
}

async function getUserCoachingSubscription(userId) {
  if (!userId || userId === '') {
    return null;
  }
  const authToken = await Auth.getUserAuthToken();

  const data = { userId };

  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/coaching/subscriptions/list`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data,
      json: true,
    };
    const response = await axios(options);
    if (response && response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    notifyAPIError(error, {
      message: 'Failed to get user coaching subscription',
    });
    return null;
  }
}

async function getUserPlaylist(userId, playlistId) {
  if (!playlistId || playlistId === '' || !userId || userId === '') {
    return null;
  }

  try {
    const value = await FirebaseDatabase.getValue(
      `/customPlaylist/${userId}/${playlistId}`
    );
    if (!value) {
      return null;
    }
    return value;
  } catch (error) {
    Logger.error('Failed to get playlist details', { error });
  }
  return null;
}

async function getUserCoachingAppointments(data = {}) {
  const authToken = await Auth.getUserAuthToken();

  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/appointments/list`,
      data,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    notifyAPIError(error, {
      message: 'Error while getting user appointment list',
    });
    return null;
  }
}

export {
  getUser,
  verifySessionCookie,
  getUserFirstName,
  getUserPhoto,
  setUser,
  updateUser,
  setUserWithoutAuth,
  createFirebaseProfile,
  createUserProfileFromAuth,
  getUserFromAuth,
  getUserFromEmail,
  getUserFromReferralCode,
  getUserReferrals,
  getUserReferralFriends,
  getUserSubscription,
  confirmEmail,
  unsubscribeFromEmails,
  getPersonalizedFeedTopics,
  getUserContentTypePreference,
  followUser,
  isOrganicUser,
  sentFamilyPlanInvite,
  getFamilyPlanInviteList,
  setFamilyPlanInviteList,
  isUserAlreadyPurchasedCourse,
  isUserAlreadyPurchasedEvent,
  isUserContentSubscriber,
  isUserCoachingSubscriber,
  isUserCommunitySubscriber,
  setUserPhoneNumber,
  getRecommendationList,
  setCalendar,
  getUserByEmail,
  getUserPlaylist,
  pollCommunityUserSubscriptionExists,
  pollUserExists,
  getUserCoachingSubscription,
  getUserCoachingAppointments,
};
