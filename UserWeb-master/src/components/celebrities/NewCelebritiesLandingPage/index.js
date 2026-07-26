import React, { useRef, useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import ContentTypes from '@/components/newLandingPageContent/ContentTypes';
import CoachListSlider from '@/components/newLandingPageContent/CoachListSlider';
import AuraStatistics from '@/components/newLandingPageContent/AuraStatistics';
import Reviews from '@/components/newLandingPageContent/Reviews';
// import FaqList from '@/components/payment/clean/FaqList';
import routeConstants from '@/utils/constants/routes';
import classNames from 'classnames';
import { getMeditationPhoto } from '@/models/meditation';
import celebritiesSlug from '@/utils/constants/celebrities';
import MasterClassItem from '../MasterClassItem';
import MasterClassTrailerModal from '../MasterClassTrailerModal';

function NewCelebritiesLandingPage({ onContinue, celebrity }) {
  const {
    name,
    firstName,
    // profession,
    description,
    profile,
    thumbnail,
    aboutUsProfile,
    aboutUsBackground,
    slug,
    footerProfile,
    masterClass,
    quoteLines,
    showMasterclassLayout,
    heroBackground,
    heroMobileBackground,
    masterclassTitle,
  } = celebrity || {};

  const [showFooter, setShowFooter] = useState(false);
  const { classes = [], trailer } = masterClass || {};
  const [classesList, setClassesList] = useState(classes.slice(0, 8));
  const [showMore, setShowMore] = useState(classes.length > 8);

  const trailerThumbnail = getMeditationPhoto(trailer);
  const MasterClassTrailerModalRef = useRef(null);
  const showMasterClassTrailerModal = useCallback(() => {
    if (MasterClassTrailerModalRef.current) {
      MasterClassTrailerModalRef.current.show();
    }
  }, [MasterClassTrailerModalRef]);

  const handleMoreClick = () => {
    if (showMore) {
      setClassesList([...classes]);
      setShowMore(false);
    }
  };

  useEffect(() => {
    function handleScroll() {
      if (!showFooter && window.scrollY > 10) setShowFooter(true);
      else setShowFooter(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="page-body">
      <Head>
        <title>{`Aura X ${name}`}</title>
        <meta content={description} name="description" />
        <meta content={`Aura X ${name}`} property="og:title" />
        <meta content={description} property="og:description" />
        <meta itemProp="image" content={thumbnail} property="og:image"></meta>
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CELEBRITIES}/${slug}`}
        />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CELEBRITIES}/${slug}`}
        />
      </Head>
      <link
        href="/static/css/new-celebrities-landing-page.css"
        rel="stylesheet"
        type="text/css"
      />
      {heroBackground && (
        <link
          rel="preload"
          as="image"
          href={heroBackground}
          type="image/webp"
        />
      )}
      {heroMobileBackground && (
        <link
          rel="preload"
          as="image"
          href={heroMobileBackground}
          type="image/webp"
        />
      )}

      <div
        className={classNames('banner-main-warpper', {
          'ashley-greene-banner-new ': slug === celebritiesSlug.ASHLEY_GREENE,
          // 'ashley-greene-banner': slug === celebritiesSlug.ASHLEY_GREENE,
          'greg-louganis-banner-new': slug === celebritiesSlug.GREG_LOUGANIS,
          'michael-beasley-banner': slug === celebritiesSlug.MICHAEL_BEASLEY,
        })}>
        <header className="custom-container">
          <nav
            className={classNames('nav-main', {
              'nav-main-no-border': showMasterclassLayout,
            })}>
            <div>
              <Image
                src="/static/images/celebrities/logo.png"
                alt="logo"
                width={128}
                height={50}
                className="logo"
              />
            </div>
          </nav>
        </header>
        <div className="banner-main">
          <div className="banner-detail">
            {showMasterclassLayout && (
              <Image
                src="/static/images/celebrities/playIcon.png"
                className="clickable hero-play-icon"
                alt="Play"
                onClick={showMasterClassTrailerModal}
                height={80}
                width={80}
              />
            )}
            <div className={`banner-head ${slug}`}>
              {!showMasterclassLayout ? (
                <>
                  <div
                    style={{
                      filter:
                        'drop-shadow(0px 0px 21.536914825439453px rgba(255, 255, 255, 0.75))',
                    }}>
                    Aura
                  </div>
                  <img
                    src="/static/images/celebrities/cross.svg"
                    alt=""
                    className="cross-img"
                  />
                  <div
                    style={{
                      filter:
                        'drop-shadow(0px 0px 21.536914825439453px rgba(255, 255, 255, 0.75))',
                    }}>
                    {name}
                  </div>
                </>
              ) : (
                masterclassTitle
              )}
            </div>

            {/* <div className="banner-sub-head">{profession}</div> */}
            <div className="banner-text">{description}</div>
            <div className="banner-button-group">
              <button className="banner-button" onClick={onContinue}>
                Try For Free
              </button>
            </div>

            <div className="best-of-apple">
              <Image
                src="/static/images/bestOfAppleWhite.png"
                alt="best-of-apple"
                height={40}
                width={150}
              />
              <div className="loved-by-text">Loved by 7 Million+ people</div>
            </div>

            <div className="get-unlimited-access-text">
              {masterClass
                ? `Get unlimited access to this Aura Masterclass and 20,000+ meditations,
              sleep, and wellness tracks on Aura`
                : `Get unlimited access to 20,000+ meditations, sleep, and wellness tracks on Aura`}
            </div>

            {/* {masterClass && (
              <div
                className="banner-link clickable"
                onClick={showMasterClassTrailerModal}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none">
                  <path
                    d="M21.5 10.634C22.1667 11.0189 22.1667 11.9811 21.5 12.366L7.25 20.5933C6.58333 20.9782 5.75 20.497 5.75 19.7272L5.75 3.27276C5.75 2.50296 6.58333 2.02183 7.25 2.40673L21.5 10.634Z"
                    fill="white"
                  />
                </svg>
                <span className="banner-link-text">Watch Trailer</span>
              </div>
            )} */}
          </div>
          {!showMasterclassLayout && (
            <>
              <div className="banner-ring-img">
                <span className="banner-ring-wrap">
                  <span className="banner-ring"></span>
                </span>
                <span className="banner-white-ring"></span>
              </div>
              <Image
                height={520}
                width={480}
                src={profile}
                alt=""
                className={classNames('banner-user-img', {
                  'michael-beasley-user':
                    slug === celebritiesSlug.MICHAEL_BEASLEY,
                  'greg-louganis-user': slug === celebritiesSlug.GREG_LOUGANIS,
                })}
              />
            </>
          )}
          <div className="banner-gradient-wrap"></div>
        </div>
      </div>

      {masterClass && (
        <>
          <section className="masterclass-main">
            <div className="custom-container">
              <div className="masterclass-head">{`${firstName}’s Class`}</div>
              <div className="video-main">
                <div className="video-container">
                  <div
                    className="video-wrapper"
                    onClick={showMasterClassTrailerModal}>
                    <Image
                      height={400}
                      width={800}
                      src={
                        slug === celebritiesSlug.ASHLEY_GREENE ||
                        slug === celebritiesSlug.GREG_LOUGANIS
                          ? thumbnail
                          : trailerThumbnail || thumbnail
                      }
                      alt="masterclass video"
                    />
                    <svg
                      className="video-play"
                      xmlns="http://www.w3.org/2000/svg"
                      width="85"
                      height="85"
                      viewBox="0 0 85 85"
                      fill="none">
                      <circle
                        opacity="0.6"
                        cx="42.5"
                        cy="42.5"
                        r="42.5"
                        fill="black"
                      />
                      <path
                        d="M60.5 41.134C61.1667 41.5189 61.1667 42.4811 60.5 42.866L33.5 58.4545C32.8333 58.8394 32 58.3583 32 57.5885L32 26.4115C32 25.6417 32.8333 25.1606 33.5 25.5455L60.5 41.134Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
                <div className="video-play-list-main">
                  <div
                    className="video-trailer clickable"
                    onClick={showMasterClassTrailerModal}>
                    <Image
                      height={40}
                      width={40}
                      className="trailer-icon"
                      src="/static/images/celebrities/trailer-icon.png"
                      alt="trailer-icon"
                    />
                    <span>Trailer</span>
                  </div>
                  <div className="video-head">Browse Classes</div>
                  <div className="video-play-list">
                    {classesList.map((item, index) => (
                      <MasterClassItem
                        item={item}
                        index={index + 1}
                        key={index}
                      />
                    ))}
                    {showMore && (
                      <div
                        className="more-button clickable"
                        onClick={handleMoreClick}>
                        ... more
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="video-detail">
                <div className="video-detail-head">
                  About this Aura Masterclass
                </div>
                <div
                  className="about-banner"
                  style={{
                    // background: `url(${aboutUsBackground})`,
                    backgroundSize: 'cover',
                  }}>
                  <Image
                    fill
                    src={aboutUsBackground}
                    alt="about-us-background"
                    style={{ objectFit: 'cover', borderRadius: '16px' }}
                  />
                  <Image
                    className="about-banner-img"
                    src={aboutUsProfile}
                    alt="about-us-profile"
                    height={320}
                    width={225}
                  />
                </div>
                <div className="video-detail-text">{masterClass.intro}</div>
              </div>
            </div>
          </section>

          <div className="divider"></div>
        </>
      )}
      {quoteLines && (
        <>
          <section className="quote-section">
            <Image
              height={80}
              width={100}
              className="quote-icon"
              src="/static/images/celebrities/quoteIcon.svg"
              alt="quote-icon"
            />
            <div>
              {quoteLines.line1 && (
                <div className="quote-text">{quoteLines.line1}</div>
              )}
              {quoteLines.line2 && (
                <div className="quote-text">{quoteLines.line2}</div>
              )}
            </div>
          </section>

          <div className="divider"></div>
        </>
      )}
      {/* content types */}

      <ContentTypes
        celebritieSlug={slug}
        addMasterClass
        onContinue={onContinue}
        isCelebritieLandingPage
        title={'Your All-In-One App for Mindfulness & Well-being'}
        subTitle={`From meditations to stories to CBT, find everything you need for your whole well-being, all in Aura.`}
      />

      {/* coaches list slider */}

      <CoachListSlider isCelebritieLandingPage />

      {/* What’s in every Aura membership? */}

      <section className="membership-main">
        <div className="custom-container">
          <div className="membership-wrap">
            <div className="membership-head">
              {`What's in every Aura membership?`}
            </div>
            <div className="membership-details">
              <div className="membership-details-list">
                <div className="details-wrap">
                  <Image
                    height={21}
                    width={21}
                    alt=""
                    src="/static/images/celebrities/RecentSessions.svg"
                  />
                  <div className="details-text">
                    Unlimited access to 10,000+ meditations, CBT, life coaching,
                    stories, music, nature sounds, & more
                  </div>
                </div>
                <div className="details-wrap">
                  <Image
                    height={21}
                    width={21}
                    alt=""
                    src="/static/images/celebrities/Emotions.svg"
                  />

                  <div className="details-text">
                    Fall asleep faster, reduce stress and anxiety and find peace
                    every day
                  </div>
                </div>
                <div className="details-wrap">
                  <Image
                    height={21}
                    width={21}
                    alt=""
                    src="/static/images/celebrities/exclusiveContentIcon.svg"
                  />
                  <div className="details-text">
                    Join live sessions & connect with the community
                  </div>
                </div>
                <div className="details-wrap">
                  <Image
                    height={21}
                    width={21}
                    alt=""
                    src="/static/images/celebrities/unlimitedAcessIcon.svg"
                  />
                  <div className="details-text">
                    Exclusive content from top mindfulness experts,
                    psychologists, and therapists
                  </div>
                </div>
              </div>
              <div className="details-button-wrap">
                <button
                  className="details-button clickable"
                  onClick={onContinue}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* aura state */}
      <AuraStatistics onContinue={onContinue} isCelebritieLandingPage />

      <Reviews isCelebritieLandingPage />

      {/* <section className="masterclass-main">
        <div className="custom-container">
          <div className="masterclass-head">Frequently asked questions</div>
        </div>
        <FaqList isCelebritieLandingPage />
      </section> */}

      <footer className="footer-main">
        <div className="footer-detail">
          <div className="footer-head">
            {!showMasterclassLayout
              ? `Listen to ${firstName}'s Story, only on Aura`
              : `Watch ${firstName}’s Aura Masterclass,
Only on Aura`}
          </div>
          <div
            className={classNames('footer-detail-img-wrap', {
              'michel-footer-detail-img-wrap':
                celebritiesSlug.MICHAEL_BEASLEY === slug,
              'greg-footer-detail-img-wrap':
                celebritiesSlug.GREG_LOUGANIS === slug,
            })}>
            <Image
              height={440}
              width={440}
              className="footer-detail-img"
              src={footerProfile}
              alt="footer-img "
            />
          </div>
          {/* <div className="footer-head">{`Aura X ${name}`}</div>
          <div className="footer-sub-head">{profession}</div>
          <div className="footer-text">{description}</div> */}
          <div className="footer-button-group">
            <button className="footer-button clickable" onClick={onContinue}>
              {!showMasterclassLayout
                ? 'Listen on Aura'
                : 'Watch this Masterclass'}
            </button>
          </div>
          <div className="footer-text">
            {masterClass
              ? `Get unlimited access to this Aura Masterclass and 20,000+ meditations,
              sleep, and wellness tracks on Aura`
              : `Get unlimited access to 20,000+ meditations, sleep, and wellness tracks on Aura`}
          </div>
        </div>
        <div className="custom-container">
          <div className="footer-copy-right">
            <div className="copy-right">© 2023 Aura Health</div>
            <div className="contact">
              Contact us: <a href="#">hello@aurahealth.io</a>
            </div>
          </div>
        </div>
        <div
          className={classNames('footer-contact', {
            'fix-footer-bottom': showFooter,
          })}>
          <div className="custom-container footer-contact-wrap">
            <div className="footer-contact-text">
              {`Get unlimited access to ${
                showMasterclassLayout ? 'this Masterclass and' : ''
              } Aura`}
            </div>
            <button
              className="footer-contact-button clickable"
              onClick={onContinue}>
              Sign Up
            </button>
          </div>
        </div>
      </footer>

      <MasterClassTrailerModal
        trailerData={trailer}
        ref={MasterClassTrailerModalRef}
        celebrityData={celebrity}
        onContinue={onContinue}
      />
    </div>
  );
}

export default NewCelebritiesLandingPage;
