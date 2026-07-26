import {
  subDays,
  isSameDay,
  isYesterday,
  getHours,
  format,
  isToday,
} from 'date-fns';
import Analytics from '../services/Analytics';
import FbPixel from '../services/FbPixel';
import Logger from '../services/Logger';
import TiktokPixel from '../services/TiktokPixel';
import contentConstants from '../utils/constants/content';
import FirebaseDatabase from '../services/FirebaseDatabase';
import { isUserContentSubscriber, updateUser } from './user';

async function recordTrackPlay({ profile, id, track, analyticsOptions = {} }) {
  if (!track) {
    return;
  }
  const {
    morningRoutineProgressCount,
    meditationProgressCount,
    lastMorningRoutineDate,
    morningStreak,
    morningStreakMax,
  } = profile || {};
  const {
    session,
    trackType,
    channel,
    title,
    unguided,
    userId: trackAuthorId,
    source: trackAuthor,
  } = track;
  const {
    duration = null,
    sentFrom = null,
    score,
    modelSource,
    emotion = null,
    offline = false,
    sectionIndex,
    sectionLabel,
    sectionTrackIndex,
    topic = null,
  } = analyticsOptions;

  const eventProperties = {
    Channel: channel?.key,
    CoachID: trackAuthorId,
    'Coach Name': trackAuthor,
    Duration: duration,
    Emotion: emotion || sentFrom,
    Guided: !unguided,
    'Model Score': score,
    'Model Source': modelSource,
    Offline: offline,
    Premium: isUserContentSubscriber(profile),
    'Section Index': sectionIndex,
    'Section Label': sectionLabel,
    'Section Track Index': sectionTrackIndex,
    'Section Track Label': title,
    'Sent from': sentFrom,
    Session: session,
    Topic: topic,
    Title: title,
    Type: trackType,
  };
  if (profile) {
    eventProperties['Day N'] =
      !lastMorningRoutineDate || !isToday(new Date(lastMorningRoutineDate))
        ? morningRoutineProgressCount + 1
        : morningRoutineProgressCount;
    eventProperties.First = !lastMorningRoutineDate;
    eventProperties.morningStreak = morningStreak;
    eventProperties.morningStreakMax = morningStreakMax;
    eventProperties['Session N'] = meditationProgressCount + 1;
  }

  Analytics.track('Meditation play', eventProperties);
  if (id && profile) {
    try {
      const trackPlaysId = await FirebaseDatabase.generateId('trackPlays');
      await FirebaseDatabase.setValue(`/trackPlays/${trackPlaysId}`, {
        userId: id,
        emotion,
        time: new Date().toJSON(),
        trackId: session,
      });
    } catch (error) {
      Logger.error('Failed to update trackPlays', { error });
    }
    try {
      await FirebaseDatabase.setValue(
        `users/${id}/playedTracks/${session}`,
        true
      );
    } catch (error) {
      Logger.error('Failed to update user playedTracks', { error });
    }
  }
}

async function recordTrackPreview({
  event,
  profile,
  track,
  analyticsOptions = {},
}) {
  if (!track) {
    return;
  }
  const {
    morningRoutineProgressCount,
    meditationProgressCount,
    lastMorningRoutineDate,
    morningStreak,
    morningStreakMax,
  } = profile || {};
  const {
    session,
    trackType,
    channel,
    title,
    unguided,
    userId: trackAuthorId,
    source: trackAuthor,
  } = track;
  const {
    duration = null,
    sentFrom = null,
    score,
    modelSource,
    emotion = null,
    offline = false,
    sectionIndex,
    sectionLabel,
    sectionTrackIndex,
    topic = null,
  } = analyticsOptions;

  const eventProperties = {
    Channel: channel?.key,
    CoachID: trackAuthorId,
    'Coach Name': trackAuthor,
    Duration: duration,
    Emotion: emotion || sentFrom,
    Guided: !unguided,
    'Model Score': score,
    'Model Source': modelSource,
    Offline: offline,
    Premium: isUserContentSubscriber(profile),
    'Section Index': sectionIndex,
    'Section Label': sectionLabel,
    'Section Track Index': sectionTrackIndex,
    'Section Track Label': title,
    'Sent from': sentFrom,
    Session: session,
    Topic: topic,
    Title: title,
    Type: trackType,
  };
  if (profile) {
    eventProperties['Day N'] =
      !lastMorningRoutineDate || !isToday(new Date(lastMorningRoutineDate))
        ? morningRoutineProgressCount + 1
        : morningRoutineProgressCount;
    eventProperties.First = !lastMorningRoutineDate;
    eventProperties.morningStreak = morningStreak;
    eventProperties.morningStreakMax = morningStreakMax;
    eventProperties['Session N'] = meditationProgressCount + 1;
  }
  Analytics.track(event, eventProperties);
}

async function postMeditationDone({
  profile,
  id,
  track,
  analyticsOptions = {},
}) {
  if (!track) return {};

  const { trackType } = track;
  if (trackType === contentConstants.CONTENT_TYPES.MUSIC) {
    await sendAnalytics({ profile, track, analyticsOptions });
    return {};
  }

  let updatedProfile = { ...(profile || {}) };
  if (profile && id) {
    const updatedStreaks = await updateUserStreak({ profile, id });
    updatedProfile = { ...updatedProfile, ...updatedStreaks };
    const meditationProgressUpdate = await updateMeditationProgress({
      profile: updatedProfile,
      id,
      track,
      analyticsOptions,
    });
    updatedProfile = { ...updatedProfile, ...meditationProgressUpdate };
  }

  const analyticsUpdate = await sendAnalytics({
    profile: updatedProfile,
    id,
    track,
    analyticsOptions,
  });
  updatedProfile = { ...updatedProfile, ...analyticsUpdate };

  if (profile && id) {
    await sendRating({ profile: updatedProfile, id, track, analyticsOptions });
  }
  return updatedProfile;
}

async function updateUserStreak({ profile, id }) {
  const {
    lastMorningRoutineDate,
    morningStreak = 0,
    morningStreakMax = 0,
  } = profile;
  const today = new Date();
  const lastRoutineDate = new Date(lastMorningRoutineDate);
  const dayBeforeYesterday = subDays(today, 2);
  const isMeditationDoneToday = isSameDay(lastRoutineDate, today);
  const isMeditationDoneYesterday = isYesterday(lastRoutineDate);
  const isMeditationDoneDayBefore = isSameDay(
    lastRoutineDate,
    dayBeforeYesterday
  );
  const isBefore2am = getHours(today) < 2;
  const isMeditationDoneBefore2am = getHours(lastRoutineDate) < 2;
  const updatedStreaks = { morningStreak, morningStreakMax };
  if (
    !lastMorningRoutineDate || // First session of user
    isMeditationDoneYesterday || // Last session was done yesterday
    (isBefore2am && isMeditationDoneDayBefore) || // Last session was done day before yesterday but current time is before 2 AM
    (isMeditationDoneToday && isMeditationDoneBefore2am && !isBefore2am) // Last session was done today before 2 AM
  ) {
    updatedStreaks.morningStreak = morningStreak + 1;
  } else if (!isMeditationDoneToday) {
    // Reset user streak if last session was not done today
    updatedStreaks.morningStreak = 1;
  }
  if (updatedStreaks.morningStreak > morningStreakMax) {
    updatedStreaks.morningStreakMax = updatedStreaks.morningStreak;
  }
  await updateUser(updatedStreaks, id);
  // Update userDaysListened to keep track of streak dates
  const dateToday = format(today, 'yyyy-MM-dd');
  try {
    await FirebaseDatabase.setValue(
      `userDaysListened/${id}/${dateToday}`,
      true
    );
  } catch (error) {
    Logger.error('Failed to update userDaysListened', { error });
  }
  return updatedStreaks;
}

async function updateMeditationProgress({
  profile,
  id,
  track = {},
  analyticsOptions,
}) {
  const { session = null, trackType: type = null } = track;
  const {
    morningStreak,
    morningStreakMax,
    lastMorningRoutineDate,
    meditationProgressCount = 0,
    morningRoutineProgressCount = 0,
  } = profile;
  const { duration = null, offline = false } = analyticsOptions; // duration accepted from front-end to know which track version user played (3 or 7 min) and get user selected duration for unguided tracks
  if (!session) {
    return {};
  }
  const updatedUser = {
    lastMorningRoutineDate: new Date().toISOString(),
    lastMeditationSession: session,
  };
  await updateUser(updatedUser, id);
  const progressObj = {
    session,
    duration,
    morningStreakMax,
    morningStreak,
    type,
    offline,
    date: new Date().toISOString(),
  };
  try {
    const meditationProgressId = await FirebaseDatabase.generateId(
      `users/${id}/meditationProgress/`
    );
    await FirebaseDatabase.setValue(
      `/users/${id}/meditationProgress/${meditationProgressId}`,
      progressObj
    );
    updatedUser.meditationProgressCount = meditationProgressCount + 1;
  } catch (error) {
    Logger.error('Failed to update meditationProgress', { error });
  }
  if (!lastMorningRoutineDate || !isToday(new Date(lastMorningRoutineDate))) {
    try {
      const morningRoutineProgressId = await FirebaseDatabase.generateId(
        `users/${id}/morningRoutineProgress/`
      );
      await FirebaseDatabase.setValue(
        `/users/${id}/morningRoutineProgress/${morningRoutineProgressId}`,
        progressObj
      );
      updatedUser.morningRoutineProgressCount = morningRoutineProgressCount + 1;
    } catch (error) {
      Logger.error('Failed to update morningRoutineProgress', { error });
    }
  }
  return updatedUser;
}

async function sendAnalytics({ profile, id, track, analyticsOptions }) {
  const {
    morningStreak,
    morningStreakMax,
    meditationProgressCount,
    morningRoutineProgressCount,
    premium,
    premiumSessionDone,
  } = profile || {};
  const {
    session,
    title,
    unguided,
    channel,
    trackType,
    userId: trackAuthorId,
    source: trackAuthor,
  } = track;
  const {
    duration = null,
    sentFrom = null,
    score,
    modelSource,
    emotion = null,
    offline = false,
    sectionIndex,
    sectionLabel,
    sectionTrackIndex,
    topic = null,
  } = analyticsOptions;

  if (trackType === contentConstants.CONTENT_TYPES.MUSIC) {
    Analytics.track(`Music Listen`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Listen Duration': duration,
      Duration: duration,
      Finished: true,
      Topic: topic,
      Session: session,
      'Sent from': sentFrom,
    });
    return {};
  }

  const eventProperties = {
    Channel: channel?.key,
    CoachID: trackAuthorId,
    'Coach Name': trackAuthor,
    Duration: duration,
    Emotion: emotion || sentFrom,
    Guided: !unguided,
    'Model Score': score,
    'Model Source': modelSource,
    Offline: offline,
    Premium: isUserContentSubscriber(profile),
    'Section Index': sectionIndex,
    'Section Label': sectionLabel,
    'Section Track Index': sectionTrackIndex,
    'Section Track Label': title,
    'Sent from': sentFrom,
    Session: session,
    Topic: topic,
    Title: title,
    Type: trackType,
  };
  if (profile) {
    eventProperties['Day N'] = morningRoutineProgressCount;
    eventProperties.morningStreak = morningStreak;
    eventProperties.morningStreakMax = morningStreakMax;
    eventProperties['Session N'] = meditationProgressCount;

    Analytics.setPeopleProperties({
      morningStreak,
      morningStreakMax,
      'Day N': morningRoutineProgressCount,
      'Session N': meditationProgressCount,
    });
    Analytics.setSuperProperties({
      morningStreak,
      morningStreakMax,
      'Day N': morningRoutineProgressCount,
      'Session N': meditationProgressCount,
    });
  }

  Analytics.track('Meditation done single', eventProperties);
  FbPixel.trackStandard(
    'ViewContent',
    {
      content_category: 'Meditation done single',
      content_ids: [session],
      content_name: title,
      content_type: 'product',
    },
    { user: { ...(profile || {}), id } }
  );
  TiktokPixel.trackStandard('ViewContent', {
    content_category: 'Meditation done single',
    content_id: session,
    content_name: title,
    content_type: 'product',
  });
  const updatedUser = {};
  if (premium && !premiumSessionDone && meditationProgressCount > 1) {
    try {
      FbPixel.trackCustom(
        'af_achievement_unlocked',
        {},
        { user: { ...(profile || {}), id } }
      );
      if (!id) {
        Logger.warn('No id passed for setting premiumSessionDone');
        return {};
      }
      await FirebaseDatabase.setValue(`users/${id}/premiumSessionDone/`, true);
      updatedUser.premiumSessionDone = true;
    } catch (error) {
      Logger.error('Failed to set premiumSessionDone', { error });
    }
  }
  return updatedUser;
}

async function sendRating({
  profile,
  id,
  track,
  rating = null,
  feedback = null,
  analyticsOptions,
}) {
  if (!profile || !id) {
    return;
  }

  const {
    channel,
    session,
    trackType,
    title,
    userId: trackAuthorId,
    source: trackAuthor,
  } = track;
  const { meditationProgressCount, premium } = profile;
  const {
    duration = null,
    sentFrom = null,
    score,
    modelSource,
    emotion = null,
    offline = false,
    topic = null,
    watch = false,
  } = analyticsOptions;
  if (rating && id && channel?.key) {
    try {
      const channelRating = await FirebaseDatabase.getValue(
        `users/${id}/channelPreferences/${channel.key}`
      );
      let average = rating;
      let count = 1;
      if (channelRating && channelRating.average && channelRating.count) {
        average =
          (channelRating.average * channelRating.count + rating) /
          (channelRating.count + 1);
        count = channelRating.count + 1;
      }
      await FirebaseDatabase.updateValue(
        `users/${id}/channelPreferences/${channel.key}`,
        { average, count }
      );
    } catch (error) {
      Logger.error('Failed to update channel rating', { error });
    }
  }
  // Add to meditation feedback
  const feedbackItem = {
    userId: id,
    meditationId: session,
    sessionN: meditationProgressCount,
    rating: rating || null,
    ratingOptional: true,
    feedback: feedback || null,
    duration,
    hour: new Date().toTimeString().slice(0, 2),
    createdAt: new Date().toISOString(),
    watch: watch ? true : null,
    premium: premium ? true : null,
    channelId: channel?.key || null,
    emotion,
    topic,
    trackType: trackType || null,
  };
  try {
    const newItemLoc = await FirebaseDatabase.generateId('meditationFeedback');
    await FirebaseDatabase.setValue(
      `/meditationFeedback/${newItemLoc}`,
      feedbackItem
    );
    Analytics.track(`Meditation feedback`, {
      Channel: channel?.key,
      CoachID: trackAuthorId,
      'Coach Name': trackAuthor,
      Duration: duration,
      Emotion: emotion || sentFrom,
      Feedback: feedback || null,
      'Model Score': score,
      'Model Source': modelSource,
      Offline: offline,
      Premium: isUserContentSubscriber(profile),
      Rating: rating || null,
      'Sent from': sentFrom,
      'Session N': meditationProgressCount,
      Session: session,
      Skip: rating ? null : true,
      Topic: topic,
      Title: title,
      Type: trackType,
      Watch: watch ? true : null,
    });
  } catch (error) {
    Logger.error('Failed to update meditation feedback', { error });
  }
}

export {
  recordTrackPlay,
  recordTrackPreview,
  updateUserStreak,
  updateMeditationProgress,
  sendAnalytics,
  sendRating,
  postMeditationDone,
};
