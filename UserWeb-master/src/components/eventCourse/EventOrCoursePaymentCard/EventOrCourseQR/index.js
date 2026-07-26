import Loader from '@/components/app/Loader';
import useTranslations from '@/hooks/translations';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './styles.module.scss';

function EventOrCourseQR({ deeplink }) {
  const { t } = useTranslations();
  if (!deeplink) {
    return <Loader />;
  }
  return (
    <div className={styles.container}>
      <QRCodeCanvas value={deeplink} size={105} />
      <div className={styles.auraAppText}>{t('text_aura_app')}</div>
    </div>
  );
}
export default EventOrCourseQR;
