import React from 'react';
import Link from 'next/link';
import Text from '../../app/Text';
import Topic from '../../card/topic';
import routeConstants from '../../../utils/constants/routes';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import styles from './styles';

function CustomTopics({ data, label, showViewAllButton = false }) {
  if (!data || !data.length) {
    return null;
  }
  return (
    <div className="content-container">
      <div className="content-header">
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          {label}
        </Text>
        {showViewAllButton && (
          <Link href={routeConstants.PAGE_EXPLORE} prefetch={false}>
            <div className="view-all">
              <Text
                type="body"
                color="b64"
                weight="regular"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  textDecoration: 'none',
                  marginBottom: 8,
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                View All
              </Text>
            </div>
          </Link>
        )}
      </div>
      <CustomHorizontalScrollView
        data={data}
        renderItem={(topic) => <Topic key={topic.key} topic={topic} />}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default CustomTopics;
