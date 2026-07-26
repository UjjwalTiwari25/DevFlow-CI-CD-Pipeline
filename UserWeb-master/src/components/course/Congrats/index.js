import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import MobileAppDownload from '@/components/app/MobileAppDownload';
import Text from '@/components/app/Text';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useCourseDeeplink from '@/hooks/courseDeeplink';
import useTranslations from '@/hooks/translations';
import AuraButton from '@/components/app/AuraButton';
import Loader from '@/components/app/Loader';
import { getCourseTracksCount } from '@/models/course';
import styles from './styles.module.scss';

function Congrats({ course, courseCoach }) {
  const { deeplink } = useCourseDeeplink({ course, courseCoach });
  const { image, name } = course;
  const [, isMobile] = useResponsiveWindow();

  const { t } = useTranslations();

  const totalCourseDays = getCourseTracksCount(course);

  return (
    <div className={styles.coachRowInfo}>
      <div className={styles.frameContainer}>
        <img
          src="/static/images/coachingSession/frame-large.png"
          alt="aura"
          className={styles.frame}
        />
        <div className={styles.infoContainer}>
          <img src={image} alt={name} className={styles.courseImage} />
          <div className={styles.course}>
            <Text type="cta" color="b100" align="center" weight="semibold">
              {name}
            </Text>
            <Text type="footnote" color="b100" align="center">
              {t('course_text')}
            </Text>
            {totalCourseDays > 0 && (
              <Text type="footnote" color="b100" align="center">
                {t('course_days', { count: totalCourseDays })}
              </Text>
            )}
            <Text
              type="footnote"
              color="g50"
              align="center"
              style={{ marginTop: 8 }}>
              {t('course_start_learning_now')}
            </Text>
            <img
              src="/static/images/coachingSession/greenCheck.png"
              alt="aura green check"
              className={styles.greenCheck}
            />
          </div>
        </div>
      </div>
      <hr className={styles.hr} />
      <Text
        type={isMobile ? 'h3-large' : 'h2'}
        color="b100"
        align="center"
        weight="medium"
        style={{ marginTop: 24, lineHeight: isMobile && '29px' }}>
        {t('course_congratulations', {
          courseName: course?.name,
        })}
      </Text>
      <Text
        type={isMobile ? 'h3-large' : 'h2'}
        color="g50"
        align="center"
        weight="medium"
        style={{ lineHeight: isMobile && '29px' }}>
        {t('course_open_inside_app')}
      </Text>

      {!deeplink && <Loader style={{ width: '100', height: '100%' }} />}
      {!isMobile && (
        <div className={styles.smsButtonContainer}>
          {deeplink && <QRCodeCanvas value={deeplink} size={150} />}

          <MobileAppDownload style={{ marginTop: 24 }} />
        </div>
      )}
      {isMobile && deeplink && (
        <AuraButton
          cleanStyle
          textWeight="bold"
          title={
            <a
              href={deeplink}
              style={{
                textAlign: 'center',
                textDecoration: 'none',
                color: '#fff',
              }}>
              {t('course_open_aura_app')}
            </a>
          }
          style={{
            marginTop: 34,
            width: '100%',
            height: '65px',
            borderRadius: '99px',
          }}
          withShadow
        />
      )}
    </div>
  );
}

export default Congrats;
