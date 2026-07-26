import React from 'react';
import Text from '../../app/Text';
import contentConstants from '../../../utils/constants/content';
import Channel from '../../card/channel/Channel';
import styles from './styles';
import FloatingContentCard from '../../card/tracks/FloatingContentCard';

function ViewAllList({ data, label, title = null, topic = null }) {
  return (
    <div className="custom-list-container">
      <div className="card-header">
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          {title || `All ${label}`}
        </Text>
      </div>
      <div className="card-content">
        {data && Array.isArray(data)
          ? data.map((item, index) => (
              <ListComponent
                item={item}
                label={label}
                title={title}
                key={item.id}
                index={index}
                topic={topic}
              />
            ))
          : null}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

function ListComponent({ item, label, sectionIndex, index, title, topic }) {
  switch (label) {
    case contentConstants.CONTENT_UI_TYPES.TRACKS:
      return (
        <FloatingContentCard
          track={item}
          style={{
            marginBottom: 24,
          }}
          sectionIndex={sectionIndex}
          sectionLabel={title}
          sectionTrackIndex={index}
          topic={topic}
        />
      );
    case contentConstants.CONTENT_UI_TYPES.CHANNELS:
      return (
        <Channel
          key={item.id}
          channel={item}
          id={item.id}
          style={{
            marginBottom: 24,
          }}
        />
      );
    default:
      return null;
  }
}

export default ViewAllList;
