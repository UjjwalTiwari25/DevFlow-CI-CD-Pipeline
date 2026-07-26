import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import { Icon } from '@aurahealth/web-design-system';
import I18NFormatter from '@/services/I18NFormatter';
import useTranslations from '@/hooks/translations';
import { getEventAttendingMembers } from '@/models/event';
import EventCoachList from '../EventCoachList';
import ZoomDetails from '../ZoomDetails';
import EventGoingList from '../EventGoingList';
import styles from './styles.module.scss';

function EventHeader({
  event,
  handleButtonClick,
  isPastEvent,
  renderJoinCommunityOrEventButton,
}) {
  const { t } = useTranslations();
  const [eventAttendingMembers, setEventAttendingMembers] = useState(0);
  const [, isMobile] = useResponsiveWindow();
  const { image, title, scheduledAt } = event || {};

  useEffect(() => {
    async function fetchEventAttendingMembers() {
      const res = await getEventAttendingMembers(event.id);
      if (res && !res.error) {
        setEventAttendingMembers(res);
      }
    }
    if (event) {
      fetchEventAttendingMembers();
    }
  }, [event]);

  return (
    <div className={styles.headerContent}>
      <div className={styles.headerLeftSideContent}>
        <div className={styles.eventNameWrapper}>
          <div className={styles.eventTitle}>{title}</div>
          <div className={styles.eventScheduleDetails}>
            {isPastEvent ? (
              <div className={styles.eventScheduleItem}>
                <Icon
                  name={Icon.LIST.BulletClock}
                  size={Icon.SIZES.base}
                  className={styles.iconColor}
                />
                {event?.duration && (
                  <span>
                    {t('coaching_session_section_duration_item_min', {
                      mins: I18NFormatter.formatNumber(event?.duration),
                    })}
                  </span>
                )}
              </div>
            ) : (
              <>
                <div className={styles.eventScheduleItem}>
                  <Icon
                    name={Icon.LIST.BulletCalendar}
                    size={Icon.SIZES.base}
                    className={styles.iconColor}
                  />
                  <span>
                    {scheduledAt &&
                      I18NFormatter.formatDate(
                        new Date(scheduledAt),
                        'eee, MMM d'
                      )}
                  </span>
                </div>

                <div className={styles.eventScheduleItem}>
                  <Icon
                    name={Icon.LIST.BulletClock}
                    size={Icon.SIZES.base}
                    className={styles.iconColor}
                  />
                  <span>
                    {scheduledAt &&
                      I18NFormatter.formatDate(
                        new Date(scheduledAt),
                        'h:mmaaa'
                      )}
                  </span>

                  <span className={styles.evntTimezone}>
                    {`(${I18NFormatter.formatTimezone(new Date(scheduledAt))})`}
                  </span>
                </div>
              </>
            )}
          </div>
          {isMobile && renderJoinCommunityOrEventButton()}
        </div>
        <div className={styles.eventInfoList}>
          <EventCoachList eventCoaches={event.coaches} />
          <hr className={styles.divider} />
          <ZoomDetails
            date={
              scheduledAt &&
              I18NFormatter.formatDate(new Date(event?.scheduledAt), 'MMM d')
            }
            time={
              scheduledAt &&
              I18NFormatter.formatDate(new Date(event?.scheduledAt), 'h:mmaaa')
            }
          />
          <hr className={styles.divider} />
          {eventAttendingMembers?.length > 0 && (
            <EventGoingList eventAttendingMembers={eventAttendingMembers} />
          )}
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt="Event Image"
          className={styles.eventImage}
          height={isMobile ? 230 : 365}
          width={isMobile ? 335 : 556}
          style={{
            borderRadius: '16px',
            objectFit: 'cover',
          }}
        />
        {isPastEvent && (
          <div
            className={classNames('clickable', styles.eventImageOverlay)}
            onClick={handleButtonClick}>
            <div className={styles.playButtonContainer}>
              <Image
                src={'/static/images/playButton.svg'}
                alt="Play Button"
                height={isMobile ? 50 : 60}
                width={isMobile ? 50 : 60}
              />
              <div className={styles.watchRecordingText}>
                {t('event_watch_recording')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default EventHeader;
