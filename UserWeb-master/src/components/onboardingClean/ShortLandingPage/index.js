import { useEffect, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import useBrowserHistory from '@/hooks/browserHistory';
import { getLocaleImage } from '@/models/locale';
import { useDispatch } from 'react-redux';
import { setLightTheme, setDarkTheme } from '@/store/slices/theme';
import useTranslations from '@/hooks/translations';
import AuraButton from '@/components/app/AuraButton';
import Analytics from '@/services/Analytics';
import styles from './styles.module.scss';

const CONTENT_TYPES = [
  'short_lp_type_sleep',
  'short_lp_type_anxiety',
  'short_lp_type_stress',
  'short_lp_type_focus',
  'short_lp_type_depression',
  'short_lp_type_self_esteem',
  'short_lp_type_motivation',
  'short_lp_type_burnout',
  'short_lp_type_menopause',
  'short_lp_type_ptsd',
  'short_lp_type_emotional',
];

function ShortLandingPage({ onNext, onBack }) {
  useBrowserHistory('shortLandingPage', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();
  const dispatch = useDispatch();
  const [currentContentTypeIndex, setCurrentContentTypeIndex] = useState(3);

  useEffect(() => {
    Analytics.track('Landing Page Seen');
  }, []);

  const changeCurrentContentTypeIndex = () => {
    setCurrentContentTypeIndex((prevCount) =>
      prevCount === CONTENT_TYPES.length - 1 ? 0 : prevCount + 1
    );
  };

  useEffect(() => {
    dispatch(setLightTheme());

    const interValId = setInterval(changeCurrentContentTypeIndex, 10000);

    return () => {
      dispatch(setDarkTheme());
      clearInterval(interValId);
    };
  }, []);

  return (
    <div className={styles.page}>
      <img
        src={'/static/images/short-landing-page-bg.png'}
        alt=""
        className={styles.lightEffectBackground}
      />
      <div className={styles.contentSection}>
        <img
          src="/static/images/logo-verical-dark.png"
          alt="Aura"
          className={styles.auraLogo}
        />
        <div className={styles.title}>{t('short_lp_title')}</div>
        <div className={styles.subTitle}>{t('short_lp_subtitle')}</div>
        <div className={styles.contentTypeLoopWrapper}>
          <div className={styles.contentTypeLoopItemOne}>
            {CONTENT_TYPES.map((item, index) => (
              <div
                key={`${item}-1`}
                className={classNames(styles.contentTypeItem, {
                  [styles.grediantContentType]:
                    index === currentContentTypeIndex,
                })}>
                {t(item)}
              </div>
            ))}
          </div>
          <div className={styles.contentTypeLoopItemTwo}>
            {CONTENT_TYPES.map((item, index) => (
              <div
                key={`${item}-1`}
                className={classNames(styles.contentTypeItem, {
                  [styles.grediantContentType]:
                    index === currentContentTypeIndex,
                })}>
                {t(item)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.arrowWrapper}>
          <img
            src="/static/images/blueArrow.png"
            alt="Aura"
            className={styles.blueArrow}
          />
        </div>
        <AuraButton
          onClick={() => {
            Analytics.track('Landing Page Button Tapped', {
              Button: 'Try Aura for Free',
            });
            onNext();
          }}
          title={t('button_try_aura_for_free')}
          horizontalGradient
          style={{
            width: 300,
            height: 58,
            marginBottom: '40px',
          }}
          textStyle={{
            textShadow: '0px 4.306px 15.071px rgba(0, 0, 0, 0.15)',
            fontSize: '19px',
            fontWeight: 700,
          }}
          data-testid="tryAuraFree"
        />
        <div className={styles.socialLogo}>
          <Image
            src={getLocaleImage(
              '/static/images/bestOfAppsWinner.svg',
              currentLocale
            )}
            alt="best-of-apple"
            height={66}
            width={90}
            style={{ width: 'auto' }}
          />
          <Image
            src={getLocaleImage(
              '/static/images/verywellAward.png',
              currentLocale
            )}
            alt="very-well-award"
            height={66}
            width={106}
            style={{ width: 'auto' }}
            unoptimized
          />
        </div>
        <div className={styles.trustedByText}>
          {t('text_trusted_by_eight_million_plus')}
        </div>
      </div>
      <div className={styles.contentImageWrapper}>
        <img src="/static/images/short-lp-content-type.png" alt="" />
        <img src="/static/images/short-lp-content-type.png" alt="" />
      </div>
    </div>
  );
}
export default ShortLandingPage;
