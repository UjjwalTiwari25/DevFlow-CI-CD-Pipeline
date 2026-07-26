import React from 'react';
import { Icon } from '@aurahealth/web-design-system';
import I18NFormatter from '@/services/I18NFormatter';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function EventCard({ event, coach, eventCardWrapperStyle }) {
  const { t } = useTranslations();

  const {
    scheduledAt,
    title = t('event_default_name'),
    image = '/static/images/dion.jpg',
  } = event || {};

  return (
    <div className={classNames(styles.eventInnerCard, eventCardWrapperStyle)}>
      <img src={image} alt="" className={styles.eventInnerCardImage} />
      <div className={styles.eventBadgeWrapper}>
        <div className={styles.eventBadgeLabel}>
          {t('community_includes_live_event_badge_label')}
        </div>
        <div className={styles.eventBadgeDates}>
          <div className={styles.eventBadgeDate}>
            {I18NFormatter.formatDate(
              scheduledAt ? new Date(scheduledAt) : new Date(),
              'MMM d'
            )}
          </div>
          <div className={styles.eventBadgeDay}>
            {I18NFormatter.formatDate(
              scheduledAt ? new Date(scheduledAt) : new Date(),
              'EEE'
            )}
          </div>
        </div>
      </div>
      <div>
        <div className={styles.eventInnerCardTitle}>{title}</div>
        <div className={styles.eventInnerCardInfo}>
          {t('community_includes_live_event_by', {
            eventName: coach?.professionalTitle,
            coachName: coach?.name,
          })}
        </div>
      </div>

      <div className={styles.eventInnerCardInfoSection}>
        <div className={styles.eventGoingSection}>
          <Icon
            name={Icon.LIST.BulletClock}
            size={Icon.SIZES.extra}
            className={styles.clockIcon}
          />
          <div>
            {I18NFormatter.formatDate(
              scheduledAt ? new Date(scheduledAt) : new Date(),
              'MMM d'
            )}
          </div>
        </div>
        <div className={styles.eventInnerCardJoinedButton}>
          {t('community_includes_live_event_join_button')}
        </div>
      </div>
    </div>
  );
}
export default EventCard;
