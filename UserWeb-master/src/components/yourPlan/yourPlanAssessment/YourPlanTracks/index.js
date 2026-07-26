import React, { useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import useAuthUser from '@/hooks/authUser';
import FloatingContentCard from '@/components/card/tracks/FloatingContentCard';
import AuraContent from '../../../../services/AuraContent';
import CustomHorizontalScrollView from '../../../app/CustomHorizontalScroll';
import Text from '../../../app/Text';
import { getTopicTitle } from '../../../../models/topic';
import styles from './styles';

function YourPlanTracks({ topic, durationFilter }) {
  const [tracks, setTracks] = useState(null);
  const { t, currentLocale } = useTranslations();
  const { user: authUser } = useAuthUser();
  useEffect(() => {
    async function fetchMyTracks() {
      const meditations = await AuraContent.getTracks({
        ...topic.query,
        durationFilter,
        locale: currentLocale,
        limit: 3,
      });
      setTracks(meditations);
    }
    if (topic && topic.query && authUser) {
      fetchMyTracks();
    }
  }, [topic, durationFilter, currentLocale, authUser]);

  if (!topic.query || !tracks || tracks.length < 2) {
    return null;
  }

  return (
    <div className="custom-tracks-container">
      <div className="card-header">
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          {t(getTopicTitle(topic))}
        </Text>
      </div>
      {tracks && (
        <CustomHorizontalScrollView
          data={tracks}
          renderItem={(track) => (
            <FloatingContentCard
              isClickable={false}
              key={track.id}
              track={track}
              hideContentType={true}
              isFixedSize={true}
            />
          )}
        />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
export default YourPlanTracks;
