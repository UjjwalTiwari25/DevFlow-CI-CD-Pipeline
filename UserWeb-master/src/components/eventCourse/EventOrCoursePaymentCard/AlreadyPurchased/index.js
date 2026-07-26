import useTranslations from '@/hooks/translations';
import Loader from '@/components/app/Loader';
import { getTypeTitle } from '@/utils/community';
import styles from './styles.module.scss';
import EventOrCourseQR from '../EventOrCourseQR';

function AlreadyPurchased({ deeplink, type }) {
  const { t } = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {t('course_event_scan_this_qr', {
          type: t(getTypeTitle(type), { count: 1 }),
        })}
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
