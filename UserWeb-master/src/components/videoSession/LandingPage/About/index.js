import Image from 'next/image';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useTranslations from '@/hooks/translations';
import { getCoachName } from '@/models/coach';
import styles from './styles.module.scss';

function About({ coach }) {
  const { t } = useTranslations();
  const {
    education,
    professionalExperienceYears,
    professionalMemberships,
    nickname,
  } = coach || {};

  const [, isMobile] = useResponsiveWindow();

  if (!education && !professionalExperienceYears && !professionalMemberships)
    return null;

  return (
    <div className={styles.aboutUsWrapper}>
      <div className={styles.aboutitle}>
        {t('video_coaching_title_about', {
          nickname: nickname || getCoachName(coach),
        })}
      </div>
      <div className={styles.aboutItems}>
        {education && (
          <div>
            <div className={styles.aboutItemTitle}>
              {t('video_coaching_title_education')}
            </div>
            <div className={styles.aboutListItems}>
              {education.map((item) => (
                <div key={item} className={styles.aboutListItem}>
                  <div>
                    <Image
                      src="/static/images/videoCoaching/educationIcon.png"
                      alt=""
                      height={isMobile ? 40 : 56}
                      width={isMobile ? 40 : 56}
                    />
                  </div>
                  <div className={styles.aboutItemText}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {professionalExperienceYears && (
          <div>
            <div className={styles.aboutItemTitle}>
              {t('video_coaching_title_experience')}
            </div>

            <div className={styles.aboutListItem}>
              <div>
                <Image
                  src="/static/images/videoCoaching/experianceIcon.png"
                  alt=""
                  height={isMobile ? 40 : 56}
                  width={isMobile ? 40 : 56}
                />
              </div>
              <div className={styles.aboutItemText}>
                {t('video_coaching_text_experience_duration', {
                  duration: professionalExperienceYears,
                })}
              </div>
            </div>
          </div>
        )}
        {professionalMemberships && (
          <div>
            <div className={styles.aboutItemTitle}>
              {t('video_coaching_title_membership')}
            </div>
            <div className={styles.aboutListItems}>
              {professionalMemberships.map((item) => (
                <div key={item} className={styles.aboutListItem}>
                  <div>
                    <Image
                      src="/static/images/videoCoaching/membershipIcon.png"
                      alt=""
                      height={isMobile ? 40 : 56}
                      width={isMobile ? 40 : 56}
                    />
                  </div>
                  <div className={styles.aboutItemText}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default About;
