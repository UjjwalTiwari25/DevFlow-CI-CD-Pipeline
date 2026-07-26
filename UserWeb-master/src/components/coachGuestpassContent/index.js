import React from 'react';
import { BsCollectionPlay, BsClock } from 'react-icons/bs';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import Text from '../app/Text';
import useResponsiveWindow from '../../hooks/responsiveWindow';
import CustomHorizontalScrollView from '../app/CustomHorizontalScroll';
import styles, { globalStyles } from './styles';
import FloatingContentCard from '../card/tracks/FloatingContentCard';
import useCountryDetails from '../../hooks/countryDetails';

export default function CoachGuestPassContent({ coach, tracks, renderCTA }) {
  const {
    name,
    profilePicture,
    countryCode,
    professionalTitle = 'Mindfulness Expert',
    bio = '',
    specialties,
  } = coach;
  const { countryDetails } = useCountryDetails(countryCode);
  let specialtiesArray = [];
  if (specialties) {
    specialtiesArray = specialties.split(',');
  }
  const [, isMobile] = useResponsiveWindow();
  const { t, currentLocale } = useTranslations();

  return (
    <div>
      <link
        rel="stylesheet"
        href="/static/landingPageContent/css/aura-health.css"
      />
      <link
        rel="stylesheet"
        href="/static/landingPageContent/css/components.css"
      />
      <link
        rel="stylesheet"
        href="/static/landingPageContent/css/normalize.css"
      />
      <div className="site-mask">
        <section className="section-basic logos-section">
          <div className="container-full" data-ix="in-fade-delayed-load">
            <div className="logos-wrapper">
              <div className="logo-image-wrapper">
                <img
                  src={getLocaleImage(
                    '/static/landingPageContent/images/logo_bestof2017.png',
                    currentLocale
                  )}
                  alt="Best of 2017 Logo"
                  srcSet="/static/landingPageContent/images/logo_bestof2017-p-500.png 500w, /static/landingPageContent/images/logo_bestof2017.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/time_logo.png"
                  alt="Time Magazine Logo"
                  srcSet="/static/landingPageContent/images/time_logo-p-500.png 500w, /static/landingPageContent/images/time_logo.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/oprah.png"
                  alt="Tech Crunch Logo"
                  srcSet="/static/landingPageContent/images/oprah-p-500.png 500w, /static/landingPageContent/images/oprah.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/nbc.png"
                  alt="Tech Crunch Logo"
                  srcSet="/static/landingPageContent/images/nbc-p-500.png 500w, /static/landingPageContent/images/nbc.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/cnet.png"
                  alt="Tech Crunch Logo"
                  srcSet="/static/landingPageContent/images/cnet-p-500.png 500w, /static/landingPageContent/images/cnet.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/logo_techcrunch.png"
                  alt="Tech Crunch Logo"
                  srcSet="/static/landingPageContent/images/logo_techcrunch-p-500.png 500w, /static/landingPageContent/images/logo_techcrunch.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/logo_forbes.png"
                  alt="Forbes Magazine Logo"
                  srcSet="/static/landingPageContent/images/logo_forbes-p-500.png 500w, /static/landingPageContent/images/logo_forbes.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
              <div className="logo-image-wrapper">
                <img
                  src="/static/landingPageContent/images/logo_mindful.png"
                  alt="Mindful Magazine Logo"
                  srcSet="/static/landingPageContent/images/logo_mindful-p-500.png 500w, /static/landingPageContent/images/logo_mindful.png 600w"
                  sizes="(max-width: 479px) 35vw, (max-width: 767px) 18vw, (max-width: 991px) 140px, 9vw"
                  className="ref-logo-image"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id={4}
          className="section-no-padding"
          style={{
            backgroundColor: '#fff',
          }}>
          <div className="content-center pb70 pt-firts-div content-padding">
            <Text
              component={isMobile ? 'h3' : 'h2'}
              type={isMobile ? 'h3' : 'h2'}
              color="b100"
              weight="regular"
              align="center"
              style={{
                border: isMobile && '1px solid rgb(0, 0, 0, 0)',
                marginBottom: specialties ? 17 : 68,
              }}>
              {t('guestpass_access_all_tracks', { coachName: name })}
            </Text>
            {specialties && (
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color={isMobile ? 'b64' : 'b100'}
                weight="regular"
                align="center"
                style={{ margin: '0 10px 68px' }}>
                {t('guestpass_instant_access', { specialties })}
              </Text>
            )}
            <div className="horizontal-scroll disable-scrollbars">
              <CustomHorizontalScrollView
                data={tracks}
                isGuestPass={true}
                renderItem={(track) => (
                  <FloatingContentCard
                    isClickable={false}
                    isGuestPass={true}
                    key={track.id}
                    track={track}
                  />
                )}
              />
            </div>
            {renderCTA}
          </div>
        </section>
        <section
          id={4}
          className="section-no-padding"
          style={{
            background: 'linear-gradient(-180deg, #ffffff 0%, #ededed 100%)',
          }}>
          <div className="content-center follow-on-aura">
            <div className="pd46">
              <Text
                component={isMobile ? 'h3' : 'h2'}
                type={isMobile ? 'h3' : 'h2'}
                color="b100"
                weight="regular"
                align="center"
                style={{ border: isMobile && '1px solid rgb(0, 0, 0, 0)' }}>
                {t('guestpass_follow_on_aura', { coachName: name })}
              </Text>
            </div>
            <img alt="avatar" className="avatar" src={profilePicture} />
            <Text
              type="h3"
              component="h3"
              color="b100"
              weight="regular"
              align="center"
              style={{ marginTop: 20 }}>
              {name}
            </Text>
            <div className="side-padding">
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color="b100"
                weight="regular"
                align="center">
                {professionalTitle}
              </Text>
            </div>
            {countryDetails && (
              <div style={{ marginTop: 16, display: 'flex' }}>
                <img
                  src={countryDetails.imageUrl}
                  alt={countryDetails.displayName}
                  style={{
                    width: 28,
                    height: 22,
                    marginRight: 8,
                  }}
                />

                <Text
                  type={isMobile ? 'body2' : 'cta'}
                  color="b100"
                  weight="regular">
                  {countryDetails.displayName}
                </Text>
              </div>
            )}
            {specialtiesArray.length > 0 && (
              <div className="values">
                {specialtiesArray.map((speciality) => (
                  <div
                    className="btn-secondary"
                    style={{ marginTop: 24 }}
                    key={speciality}>
                    <Text
                      type={isMobile ? 'body2' : 'cta'}
                      color="b100"
                      weight="regular"
                      align="center"
                      style={{
                        padding: '4px 15px',
                      }}>
                      {speciality}
                    </Text>
                  </div>
                ))}
              </div>
            )}
            {bio && (
              <div className="side-padding">
                <Text
                  type={isMobile ? 'body2' : 'cta'}
                  color="b100"
                  weight="regular"
                  align="left"
                  style={{
                    width: '84vw',
                    marginTop: 44,
                    marginBottom: 20,
                  }}>
                  {bio}
                </Text>
              </div>
            )}
            {renderCTA}
          </div>
        </section>
        <section id={4} className="aura-values content-center">
          <div style={{ padding: '0px 32px' }}>
            <Text
              component={isMobile ? 'h3' : 'h2'}
              type={isMobile ? 'h3' : 'h2'}
              color="b100"
              weight="regular"
              align="center"
              style={{ border: isMobile && '1px solid rgb(0, 0, 0, 0)' }}>
              {t('guestpass_unlimited_access')}
            </Text>
          </div>
          <div className="icons">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '60px' }}>
                <BsCollectionPlay />
              </div>
              <div className="single-icon-text">
                <Text
                  type="cta"
                  color="b100"
                  align="center"
                  weight="normal"
                  style={{ maxWidth: 150 }}>
                  {t('guestpass_personalized_tracks')}
                </Text>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img
                src="/static/images/icons/coaches.png"
                alt="coaching"
                style={{ width: 80, height: 60 }}
              />
              <div className="single-icon-text">
                <Text
                  type="cta"
                  color="b100"
                  align="center"
                  weight="normal"
                  style={{ maxWidth: 184, marginTop: 16 }}>
                  {t('guestpass_top_coaches')}
                </Text>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '60px' }}>
                <BsClock />
              </div>
              <div className="single-icon-text">
                <Text
                  type="cta"
                  color="b100"
                  align="center"
                  weight="normal"
                  style={{ maxWidth: 116 }}>
                  {t('guestpass_tracks_durations')}
                </Text>
              </div>
            </div>
          </div>
          <div className="mt100 side-padding aura-values-background">
            <Text
              component={isMobile ? 'div' : 'h2'}
              type={isMobile ? 'cta' : 'h2'}
              color="b100"
              weight="regular"
              align="center"
              style={{ marginBottom: 42 }}>
              {t('guestpass_meditations_stories_everything')}
            </Text>

            <div className="images">
              <img
                src={getLocaleImage(
                  '/static/landingPageContent/images/5e261bc81db8f14d95648ebe_screenshots_collage.png',
                  currentLocale
                )}
                sizes="100vw"
                alt=""
                className="features-image"
                data-ix="in-fade"
              />
              <img
                src={getLocaleImage(
                  '/static/landingPageContent/images/screenshots_collage_mobile_new.png',
                  currentLocale
                )}
                alt=""
                className="features-image-mobile"
                data-ix="in-fade-delayed"
              />
              <img
                src={getLocaleImage(
                  '/static/landingPageContent/images/5e261bc81db8f1c6d7648ec0_screenshots_collage_phone_new.png',
                  currentLocale
                )}
                alt=""
                className="features-image-phone"
                data-ix="in-fade-delayed"
              />
              <div className="image-row-container" data-ix="in-fade-delayed">
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/1.gratitude.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/1.gratitude-p-500.png 500w, /static/landingPageContent/images/1.gratitude.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/2.sleep.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/2.sleep-p-500.png 500w, /static/landingPageContent/images/2.sleep.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/3.meditations.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/3.meditations-p-500.png 500w, /static/landingPageContent/images/3.meditations.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/4.stories.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/4.stories-p-500.png 500w, /static/landingPageContent/images/4.stories.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/5.naturesounds.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/5.naturesounds-p-500.png 500w, /static/landingPageContent/images/5.naturesounds.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/6.lifecoaching.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/6.lifecoaching-p-500.png 500w, /static/landingPageContent/images/6.lifecoaching.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
                <div className="image-row-img-wrapper">
                  <img
                    src="/static/landingPageContent/images/7.music.png"
                    alt="Feature Screenshot"
                    srcSet="/static/landingPageContent/images/7.music-p-500.png 500w, /static/landingPageContent/images/7.music.png 542w"
                    sizes="100vw"
                    className="image-row-img"
                  />
                </div>
              </div>
            </div>
            {renderCTA}
          </div>
        </section>
        <section>
          <div className="page-content">
            <img
              src={getLocaleImage(
                '/static/images/bestOfAppleWhite.png',
                currentLocale
              )}
              id="best-of-apple"
              alt="Best of Apple"
            />

            <Text
              component={isMobile ? 'h3' : 'h2'}
              type={isMobile ? 'h3' : 'h2'}
              align="center"
              color="w100"
              style={{ border: isMobile && '1px solid rgb(0, 0, 0, 0)' }}>
              {t('guestpass_reviews')}
            </Text>

            <img
              src="/static/images/new5stars.png"
              alt="5 starts"
              style={{ width: 216 }}
            />
            <Text type="h3" align="center" color="w100"></Text>
          </div>
        </section>
        <section id={4} className="last-section-background">
          <div className="content-center pb70 pt-last-div">
            <Text
              style={{
                width: '84vw',
                border: isMobile && '1px solid rgb(0, 0, 0, 0)',
              }}
              component={isMobile ? 'h3' : 'h2'}
              type={isMobile ? 'h3' : 'h2'}
              align="center"
              color="b100">
              {t('guestpass_claim_today', { count: 30 })}
            </Text>

            <div>
              <img
                className="aura-card"
                src={getLocaleImage(
                  '/static/images/guestPass.png',
                  currentLocale
                )}
                alt="Guest Pass Card"
                style={{
                  width: 'auto',
                  height: 174,
                }}
              />
            </div>
            {renderCTA}
          </div>
        </section>
      </div>
      <style jsx global>
        {globalStyles}
      </style>
      <style jsx>{styles}</style>
    </div>
  );
}
