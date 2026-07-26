import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Icon, ButtonCenter } from '@aurahealth/web-design-system';
import { QRCodeCanvas } from 'qrcode.react';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Analytics from '@/services/Analytics';
import Loader from '@/components/app/Loader';
import I18NFormatter from '@/services/I18NFormatter';
import useEventDeeplink from '@/hooks/eventDeeplink';
import styles from './styles.module.scss';

function Congrats({
  event,
  eventCoach,
  isPastEvent,
  community,
  isUserPurchasedEvent,
}) {
  const router = useRouter();
  const { image, title, duration, scheduledAt } = event;
  const [, isMobile] = useResponsiveWindow();
  const { t } = useTranslations();
  const { deeplink } = useEventDeeplink({ event, eventCoach });
  useEffect(() => {
    Analytics.track('Event Reserved', {
      'Sent From': 'Event Landing Page',
      'Page Name': 'Event',
      'Page Path': router.asPath,
      'Page Type': 'Event and Community',
      'Community Name': community?.name,
      'Community ID': community?.id,
      'Community Owner ID': community?.ownerId,
      'Coach Name': eventCoach?.name,
      'Coach ID': eventCoach?.id,
      'Event Name': event?.name,
      'Event ID': event?.id,
      'Meeting Method': 'Zoom',
      'Event Purchase Status': isUserPurchasedEvent
        ? 'Purchased'
        : 'Not Purchased',
    });
  }, []);

  return (
    <div className={styles.coachRowInfo}>
      <div className={styles.youreIn}>{t('text_youre_in')}</div>

      <img src={image} alt={title} className={styles.eventImage} />

      <div className={styles.eventTitle}>{title}</div>

      {!isPastEvent ? (
        <div className={styles.eventScheduleDetails}>
          <div className={styles.eventScheduleItem}>
            <Icon
              name={Icon.LIST.BulletCalendar}
              size={Icon.SIZES.base}
              className={styles.iconColor}
            />
            <span>
              {scheduledAt &&
                I18NFormatter.formatDate(new Date(scheduledAt), 'eee, MMM d')}
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
                I18NFormatter.formatDate(new Date(scheduledAt), 'h:mmaaa')}
            </span>
            <span>
              {`(${I18NFormatter.formatTimezone(new Date(scheduledAt))})`}
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
          {duration && (
            <span>
              {t('coaching_session_section_duration_item_min', {
                mins: I18NFormatter.formatNumber(duration),
              })}
            </span>
          )}
        </div>
      )}

      {!isPastEvent && (
        <div className={styles.calendarInvite}>
          {t('event_congrats_we_sent_calendar_invite')}
        </div>
      )}

      {isPastEvent && isMobile && (
        <div className={styles.calendarInvite}>
          {t('event_success_download_aura_app')}
        </div>
      )}
      {!isMobile && <hr className={styles.hr} />}

      {!isMobile && (
        <div className={styles.scanQrCode}>
          {t(
            isPastEvent
              ? 'event_congrats_scan_qr_code_to_access_recording'
              : 'event_congrats_scan_qr_code_to_access_event'
          )}
        </div>
      )}

      {!deeplink && <Loader style={{ width: '100', height: '100%' }} />}
      {!isMobile && (
        <div>{deeplink && <QRCodeCanvas value={deeplink} size={110} />}</div>
      )}
      {isMobile && deeplink && (
        <div className={styles.auraButton}>
          <ButtonCenter
            style={{
              width: '100%',
            }}
            text={t('button_download_aura_app')}
            height="large"
            type="cta-blue"
            textStyle={{
              fontSize: 20,
            }}
            onClick={() => {
              window.open(deeplink);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Congrats;
