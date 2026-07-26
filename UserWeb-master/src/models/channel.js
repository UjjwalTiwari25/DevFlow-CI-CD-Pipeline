import FirebaseDatabase from '../services/FirebaseDatabase';
import Logger from '../services/Logger';

function isChannelActive(channel) {
  if (!channel) return false;
  const { inactive, approved, deleted } = channel;
  return !inactive && approved && !deleted;
}

async function listChannels() {
  Logger.debug('channels: list');
  const channels = [];
  const response = await FirebaseDatabase.getValue(`/channels`);
  if (response && Object.keys(response).length) {
    Object.keys(response).forEach((key) => {
      const channel = { id: key, ...response[key] };
      if (isChannelActive(channel)) {
        delete channel.subscribers;
        channels.push(channel);
      }
    });
  }
  return channels;
}

function filterChannels({ channels, query, userProfile }) {
  Logger.debug('filter channels', { query });
  if (!query) {
    return channels;
  }
  const { type, category } = query;
  let filteredChannels = channels;
  if (type) {
    let trackType = type;
    if (trackType === `meditation`) {
      trackType = `mindfulness`;
    }
    filteredChannels = channels.filter((channel) => {
      let channelType = `mindfulness`;
      if (channel.channelType) {
        ({ channelType } = channel);
      }
      return channelType === trackType;
    });
  }
  if (category) {
    if (category === 'topSubscribed') {
      filteredChannels.sort((a, b) => b.nSubscribers - a.nSubscribers);
    }
    if (category === 'topRated') {
      filteredChannels = filteredChannels.filter((channel) => {
        return channel.analytics && channel.analytics.averageRating;
      });
      filteredChannels.sort(
        (a, b) => b.analytics.averageRating - a.analytics.averageRating
      );
    }
    if (userProfile && userProfile.channels) {
      filteredChannels = filteredChannels.filter((channel) => {
        if (userProfile.channels[channel.key]) {
          return false;
        }
        return true;
      });
    }
  }
  return filteredChannels;
}

async function getChannel(id) {
  Logger.debug(`channels: get ${id}`);
  const channel = await FirebaseDatabase.getValue(`/channels/${id}`);
  if (isChannelActive(channel)) {
    channel.id = id;
    delete channel.subscribers;
    return channel;
  }
  return null;
}

function getChannelPhoto(channel, size) {
  const channelPhotoUrl = `https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/auraTrackPic.png?alt=media&token=06b53bb7-8f44-4da0-a47a-82d94c030fbb`;
  if (!channel) {
    return channelPhotoUrl;
  }
  if (
    size &&
    channel.channelPictureThumbs &&
    channel.channelPictureThumbs[size]
  ) {
    return channel.channelPictureThumbs[size];
  }
  if (channel.channelPicture) {
    return channel.channelPicture;
  }
  return channelPhotoUrl;
}

function getAuthorPhoto(channel, imageSize = 'photo100Url') {
  let authorPhotoUrl;
  if (
    channel &&
    channel.authorPhotoThumbs &&
    channel.authorPhotoThumbs[imageSize]
  ) {
    return channel.authorPhotoThumbs[imageSize];
  }
  if (channel && channel.authorPhoto) {
    authorPhotoUrl = channel.authorPhoto;
  }
  return authorPhotoUrl;
}

async function getChannelIdFromSlug(slug) {
  const channelId = await FirebaseDatabase.getValue(`/slugChannel/${slug}`);
  if (!channelId) {
    Logger.error('Error fetching channel id - channel id not found', { slug });
    return null;
  }
  return channelId;
}

async function listChannelSlugs() {
  const channelList = await FirebaseDatabase.getValue(`/slugChannel`);
  if (!channelList) {
    Logger.error('Error fetching channel list');
    return null;
  }
  return channelList;
}

export {
  isChannelActive,
  getChannel,
  listChannels,
  filterChannels,
  getChannelPhoto,
  getAuthorPhoto,
  getChannelIdFromSlug,
  listChannelSlugs,
};
