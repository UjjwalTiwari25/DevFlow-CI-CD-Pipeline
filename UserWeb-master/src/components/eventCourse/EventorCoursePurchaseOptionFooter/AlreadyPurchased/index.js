import Image from 'next/image';
import useTranslations from '@/hooks/translations';
import Loader from '@/components/app/Loader';
import EventOrCourseQR from '../../EventOrCoursePaymentCard/EventOrCourseQR';
import styles from './styles.module.scss';

function AlreadyPurchased({ deeplink, type }) {
  const { t } = useTranslations();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.gradientGiftIconWrapper}>
          <Image
            alt="gift-icon"
            src="/static/icons/gradient-gift.svg"
            height={28}
            width={28}
          />
        </div>
        <div className={styles.title}>
          {t('course_event_scan_this_qr', {
            type: t(type, { count: 1 }),
          })}
        </div>
      </div>
      <div>
        {!deeplink ? (
          <Loader style={{ width: '100%', height: '100%' }} />
        ) : (
          <EventOrCourseQR deeplink={deeplink} />
        )}
      </div>
    </div>
  );
}
export default AlreadyPurchased;
