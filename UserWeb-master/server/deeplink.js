const { default: axios } = require('axios');
const {
  getCourse,
  getCoach,
  getCommunity,
  getEvent,
} = require('./models/coach');

async function handleDeeplinkPath(req, res) {
  const { destination, objectId } = req.params;
  let redirectTo = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/getapp`;

  // Individual handlers
  if (destination === 'community' || destination === 'communityDetails') {
    const { slugCoach, slugCommunity, ...rest } = req.query;
    let slugCommunityParam = slugCommunity;
    let slugCoachParam = slugCoach;
    if (!slugCommunityParam || !slugCoachParam) {
      const community = await getCommunity({ communityId: objectId });
      if (!community || community.error) {
        res.redirect(redirectTo);
      }
      slugCommunityParam = community.slug;
      const coach = await getCoach({ coachId: community.ownerId });
      if (!coach || coach.error) {
        res.redirect(redirectTo);
      }
      slugCoachParam = coach.slug;
    }
    const queryParams = new URLSearchParams(rest);
    redirectTo = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/coaches/${slugCoachParam}/communities/${slugCommunityParam}?${queryParams.toString()}`;
  } else if (destination === 'communityCourse') {
    const { slugCoach, slugCourse, ...rest } = req.query;
    let slugCourseParam = slugCourse;
    let slugCoachParam = slugCoach;
    if (!slugCourseParam || !slugCoachParam) {
      const course = await getCourse({ courseId: objectId });
      if (!course || course.error) {
        res.redirect(redirectTo);
      }
      slugCourseParam = course.slug;
      const coach = await getCoach({ coachId: course.ownerId });
      if (!coach || coach.error) {
        res.redirect(redirectTo);
      }
      slugCoachParam = coach.slug;
    }
    const queryParams = new URLSearchParams(rest);
    redirectTo = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/coaches/${slugCoachParam}/courses/${slugCourseParam}?${queryParams.toString()}`;
  } else if (destination === 'communityEvent') {
    const { slugCoach, slugEvent, ...rest } = req.query;
    let slugEventParam = slugEvent;
    let slugCoachParam = slugCoach;
    if (!slugEventParam || !slugCoachParam) {
      const event = await getEvent({ eventId: objectId });
      if (!event || event.error) {
        res.redirect(redirectTo);
      }
      slugEventParam = event.slug;
      const coach = await getCoach({ coachId: event.ownerId });
      if (!coach || coach.error) {
        res.redirect(redirectTo);
      }
      slugCoachParam = coach.slug;
    }
    const queryParams = new URLSearchParams(rest);
    redirectTo = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/coaches/${slugCoachParam}/events/${slugEventParam}?${queryParams.toString()}`;
  } else {
    // Branch Deeplink

    let canonicalIdentifier = req.path;
    const data = {
      channel: 'email',
      feature: 'personalizedEmails',
    };

    switch (destination) {
      case 'challengeDetails':
        data.destination = destination;
        data.objectId = objectId;
        break;
      case 'communityPost':
        data.destination = destination;
        data.objectId = objectId;
        data.type = req.query.type;
        break;
      default:
        canonicalIdentifier = 'web-deeplink/default';
        break;
    }

    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/emails/links`,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: {
        canonicalIdentifier,
        campaignSlug: 'web-deeplink',
        data,
      },
    };
    const response = await axios(options);
    if (response && response.data && response.data.url) {
      redirectTo = response.data.url;
    }
  }
  res.redirect(redirectTo);
}

module.exports = handleDeeplinkPath;
