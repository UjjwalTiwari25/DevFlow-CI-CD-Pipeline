import React from 'react';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Image from 'next/image';
import styles from './styles.module.scss';

function ZoomDetails({ date, time }) {
  const [, isMobile] = useResponsiveWindow();
  const { t } = useTranslations();
  return (
    <div className={styles.hostLocation}>
      <div className={styles.eventLocationLabel}>
        {t('event_zoom_details_location')}
      </div>
      <div className={styles.eventLocationWrapper}>
        <Image
          alt="zoom-icon"
          src="/static/icons/zoom.svg"
          className={styles.zoomIcon}
          height={32}
          width={32}
        />
        <div>
          <div className={styles.zoomMeetingLabel}>
            {t('event_zoom_details_meeting')}
          </div>
          {!isMobile && (
            <div className={styles.zoomMeetingTime}>{`${date}, ${time}`}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZoomDetails;
