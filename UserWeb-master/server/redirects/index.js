const TRACK_ID_REDIRECTS = require('./track-id.json');
const MEDITATION_ID_REDIRECTS = require('./meditation-id.json');
const COACH_ID_REDIRECTS = require('./coaches-id.json');
const TOPIC_ID_REDIRECTS = require('./topics-slugCategory.json');
const TRACK_ID_TO_SLUG_REDIRECTS = require('./track-slugMeditation.json');
const CHANNEL_ID_REDIRECTS = require('./channels-slugChannel.json');

module.exports = {
  // Root changed to /aura to put website behind aurahealth.io
  '/': '/aura',
  // Home changed to /aura to emphasize company name
  '/home': '/aura',
  // Redirect to default pricing for subscription page
  '/subscribe': '/subscribe/BU2GRzG2hVFwS5a',
  '/subscribe/': '/subscribe/BU2GRzG2hVFwS5a',
  // Your plan page moved to kebab case
  '/yourPlan': '/your-plan',
  '/viewAll': '/view-all',
  // Content Type pages moved to kebab case
  '/contentType/meditation': '/meditation',
  '/contentType/story': '/story',
  '/contentType/lifeCoaching': '/life-coaching',
  '/contentType/natureSounds': '/music-and-sounds',
  // Content type pages moved one path lower to root page
  '/content-type/meditation': '/meditation',
  '/content-type/story': '/story',
  '/content-type/lifeCoaching': '/life-coaching',
  '/content-type/natureSounds': '/music-and-sounds',
  // Redirects for old /track pages with $ in track names
  ...TRACK_ID_REDIRECTS,
  // Redirects for old /meditation path
  ...MEDITATION_ID_REDIRECTS,
  // Redirects for coach paths with id to coach slugs
  ...COACH_ID_REDIRECTS,
  // Redirects for old /topics path to topic slugs
  ...TOPIC_ID_REDIRECTS,
  // Redirect for old track id to track slug
  ...TRACK_ID_TO_SLUG_REDIRECTS,
  // Redirect for old /channel path to channel slugs
  ...CHANNEL_ID_REDIRECTS,
};
