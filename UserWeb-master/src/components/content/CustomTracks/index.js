import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';
import Text from '../../app/Text';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import { setViewAllData } from '../../../store/slices/viewAll';
import contentConstants from '../../../utils/constants/content';
import routeConstants from '../../../utils/constants/routes';
import styles from './styles';
import FloatingContentCard from '../../card/tracks/FloatingContentCard';

function CustomTracks({
  data,
  label,
  topic = null,
  sectionIndex = null,
  viewAllLink,
  showViewAllLink = true,
  newCoachProfile = false,
}) {
  const dispatch = useDispatch();
  const [showViewAll, setShowViewAll] = useState(showViewAllLink);
  function handleClick() {
    if (!viewAllLink) {
      dispatch(
        setViewAllData({
          objectArray: data,
          selectedRow: label,
          rowLabel: contentConstants.CONTENT_UI_TYPES.TRACKS,
        })
      );
    }
  }

  if (!data || !data.length) {
    return null;
  }
  return (
    <div
      className={classNames({
        'custom-tracks-container': !newCoachProfile,
        'custom-tracks-coach': newCoachProfile,
      })}>
      <div className="card-header">
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          {label}
        </Text>
        {showViewAll && (
          <Link
            href={viewAllLink || routeConstants.PAGE_VIEW_ALL}
            prefetch={false}
            legacyBehavior>
            <a className="view-all clickable" onClick={handleClick}>
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
        setShowViewAll={showViewAllLink && setShowViewAll}
        newCoachProfile={newCoachProfile}
        rightChevronStyles={
          newCoachProfile && {
            fontSize: 20,
            color: '#4E545F',
            boxShadow: '0px 10px 35px rgba(43, 42, 107, 0.45)',
            background:
              'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
          }
        }
        leftChevronStyles={
          newCoachProfile && {
            fontSize: 20,
            color: '#4E545F',
            boxShadow: '0px 10px 35px rgba(43, 42, 107, 0.45)',
            background:
              'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
          }
        }
        renderItem={(track, index) => (
          <FloatingContentCard
            key={track.id}
            track={track}
            sectionIndex={sectionIndex}
            sectionLabel={label}
            sectionTrackIndex={index}
            topic={topic}
            isFixedSize={newCoachProfile}
            newCoachProfile={newCoachProfile}
          />
        )}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default CustomTracks;
