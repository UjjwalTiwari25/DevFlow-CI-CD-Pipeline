import React from 'react';
import contentConstants from '../../utils/constants/content';
import CustomChannels from './CustomChannels';
import CustomTracks from './CustomTracks';
import ExploreAura from './ExploreAura';

export default function CustomContent({
  pageContent,
  rowData,
  viewAllLink,
  showViewAllLink,
  sectionIndex = null, // Used for tracking row order in meditation events
  topic = null,
}) {
  const { unique, title } = rowData;
  const data = pageContent[unique];
  const commonProps = {
    data,
    label: title,
    viewAllLink,
    showViewAllLink,
    topic: topic || unique, // Used for tracking topic in meditation events
  };
  switch (rowData.contentType) {
    case contentConstants.CONTENT_UI_TYPES.EXPLORE_AURA:
      return <ExploreAura />;
    case contentConstants.CONTENT_UI_TYPES.CHANNELS:
      return <CustomChannels {...commonProps} />;
    case contentConstants.CONTENT_UI_TYPES.TRACKS:
      return <CustomTracks {...commonProps} sectionIndex={sectionIndex} />;
    default:
      return null;
  }
}
