import React, { useState } from 'react';
import Link from 'next/link';
import Text from '../app/Text';
import routeConstants from '../../utils/constants/routes';
import Coach from '../card/coach/Coach';
import CustomHorizontalScrollView from '../app/CustomHorizontalScroll';

function CustomCoaches({ data, label }) {
  const [showViewAll, setShowViewAll] = useState(true);

  if (!data || !data.length) {
    return null;
  }
  return (
    <div className="coach-container">
      <div className="coach-list-header">
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          {label}
        </Text>
        {showViewAll && (
          <Link
            href={`/${routeConstants.PAGE_COACHES}`}
            prefetch={false}
            legacyBehavior>
            <a className="view-all clickable">
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
            </a>
          </Link>
        )}
      </div>
      <CustomHorizontalScrollView
        data={data}
        renderItem={(coach) => (
          <Coach key={coach.id} coach={coach} id={coach.id} />
        )}
        setShowViewAll={setShowViewAll}
      />
      <style jsx>{`
        .coach-container {
          margin-bottom: 54px;
        }
        .coach-list-header {
          display: flex;
        }
        .view-all {
          right: 4%;
          text-decoration: none;
          margin-left: auto;
          order: 2;
        }
        @media screen and (max-width: 576px) {
          .coach-container {
            margin-bottom: 48px;
          }
        }
      `}</style>
    </div>
  );
}

export default CustomCoaches;
