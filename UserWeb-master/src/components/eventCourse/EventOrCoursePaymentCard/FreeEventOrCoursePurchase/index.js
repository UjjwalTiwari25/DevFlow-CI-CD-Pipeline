import { Icon } from '@aurahealth/web-design-system';
import I18NFormatter from '@/services/I18NFormatter';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function FreeEventOrCoursePurchase({
  eventOrCourseTitle,
  eventOrCourseScheduledAt,
  eventOrCourseDuration,
  isPastEvent,
}) {
  const { t } = useTranslations();
  return (
    <div className={styles.freeEventOrCoursePurchaseContainer}>
      <div className={styles.eventOrCourseTitle}>{eventOrCourseTitle}</div>

      {!isPastEvent ? (
        <div className={styles.eventScheduleDetails}>
          <div className={styles.eventScheduleItem}>
            <Icon
              name={Icon.LIST.BulletCalendar}
              size={Icon.SIZES.base}
              className={styles.iconColor}
            />
            <span>
              {eventOrCourseScheduledAt &&
                I18NFormatter.formatDate(
                  new Date(eventOrCourseScheduledAt),
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
              {eventOrCourseScheduledAt &&
                I18NFormatter.formatDate(
                  new Date(eventOrCourseScheduledAt),
                  'h:mmaaa'
                )}
              <span className={styles.evntTimezone}>
                {`(${I18NFormatter.formatTimezone(
                  new Date(eventOrCourseScheduledAt)
                )})`}
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.eventScheduleItem}>
          <Icon
            name={Icon.LIST.BulletClock}
            size={Icon.SIZES.base}
            className={styles.iconColor}
          />
          {eventOrCourseDuration && (
            <span>
              {t('coaching_session_section_duration_item_min', {
                mins: I18NFormatter.formatNumber(eventOrCourseDuration),
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
export default FreeEventOrCoursePurchase;
