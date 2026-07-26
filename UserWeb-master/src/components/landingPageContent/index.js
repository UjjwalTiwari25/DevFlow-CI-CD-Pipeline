import React from 'react';

export default function LandingPageContent({ renderCTA, hideDailyMoment }) {
  return (
    <div style={{ backgroundColor: '#F0F4F6' }}>
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
                  src="/static/landingPageContent/images/logo_bestof2017.png"
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
        <section id={4} className="section-no-padding">
          <div className="classic-col">
            <div className="floating-image-wrapper">
              <img
                src="/static/landingPageContent/images/conv_emotions.png"
                alt="Image of App"
                className="floating-image"
                data-ix="in-1-rl"
              />
            </div>
          </div>
          <div className="classic-col">
            <div className="classic-lead-wrapper">
              <div className="lead-block" data-ix="in-4-du">
                <h2 className="heading">How are you feeling?</h2>
                <p className="paragraph">
                  Join millions who use Aura to manage their emotions and get
                  restful sleep. <br />
                  <br />
                  Whether you&apos;re stressed, anxious, great, or having
                  trouble sleeping, <strong>simply tell Aura</strong> and find
                  strength &amp; rest.
                </p>
              </div>
            </div>
          </div>
          <div className="gradient-bg-container" data-ix="in-fade">
            <img
              src="/static/landingPageContent/images/aura_bg.jpg"
              srcSet="/static/landingPageContent/images/aura_bg-p-500.jpeg 500w, /static/landingPageContent/images/aura_bg-p-800.jpeg 800w, /static/landingPageContent/images/aura_bg-p-1080.jpeg 1080w, /static/landingPageContent/images/aura_bg-p-1600.jpeg 1600w, /static/landingPageContent/images/aura_bg-p-2000.jpeg 2000w, /static/landingPageContent/images/aura_bg.jpg 2560w"
              sizes="100vw"
              alt=""
              className="gradient-bg"
            />
          </div>
        </section>
        <section className="section-basic">
          <div className="container-basic">
            <div className="center-lead-block" data-ix="in-4-du">
              <h2 className="heading">
                Mindfulness meditations, stories, life coaching, and so much
                more
              </h2>
              <p className="paragraph">
                With thousands of empowering &amp; resonating audio tracks, Aura
                has just what you need every day, and constantly{' '}
                <strong>learns what works for you</strong>.
              </p>
            </div>
          </div>
          <img
            src="/static/landingPageContent/images/5e261bc81db8f14d95648ebe_screenshots_collage.jpg"
            srcSet="/static/landingPageContent/images/5e261bc81db8f14d95648ebe_screenshots_collage-p-500.jpeg 500w, /static/landingPageContent/images/5e261bc81db8f14d95648ebe_screenshots_collage-p-800.jpeg 800w, /static/landingPageContent/images/5e261bc81db8f14d95648ebe_screenshots_collage-p-1080.jpeg 1080w, /static/landingPageContent/images/5e261bc81db8f14d95648ebe_screenshots_collage.jpg 2560w"
            sizes="100vw"
            alt=""
            className="features-image"
            data-ix="in-fade"
          />
          <img
            src="/static/landingPageContent/images/5e261bc81db8f1108a648ebf_screenshots_collage_mobile.jpg"
            srcSet="/static/landingPageContent/images/5e261bc81db8f1108a648ebf_screenshots_collage_mobile-p-500.jpeg 500w, /static/landingPageContent/images/5e261bc81db8f1108a648ebf_screenshots_collage_mobile.jpg 1024w"
            sizes="100vw"
            alt=""
            className="features-image-mobile"
            data-ix="in-fade-delayed"
          />
          <img
            src="/static/landingPageContent/images/5e261bc81db8f1c6d7648ec0_screenshots_collage_phone.jpg"
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
        </section>
        <section className="section-no-padding">
          <div className="classic-col">
            <div className="classic-lead-wrapper-reverse">
              <div className="lead-block" data-ix="in-4-du">
                <h2 className="heading">
                  Learn from the world&apos;s top coaches&nbsp;&amp; therapists
                </h2>
                <p className="paragraph">
                  Aura&apos;s coaches share <strong>diverse</strong>{' '}
                  perspectives, voices, and teachings, so that you{' '}
                  <strong>always find </strong>
                  coaching that resonates with you.
                </p>
              </div>
            </div>
          </div>
          <div className="classic-col">
            <div className="floating-image-wrapper smaller-padding">
              <img
                src="/static/landingPageContent/images/teachers_collage_2_t.png"
                alt="Images of Teachers"
                className="floating-image-full"
                data-ix="in-1-rl"
              />
            </div>
          </div>
        </section>
        {!hideDailyMoment && (
          <section className="section-no-padding">
            <div className="classic-col">
              <div className="floating-image-wrapper fiw-align-right">
                <img
                  src="/static/landingPageContent/images/conv_player.png"
                  alt="Screenshot of App"
                  srcSet="/static/landingPageContent/images/conv_player-p-500.png 500w, /static/landingPageContent/images/conv_player.png 600w"
                  sizes="(max-width: 479px) 70vw, (max-width: 991px) 40vw, 22vw"
                  className="floating-image"
                  data-ix="in-3-lr"
                />
              </div>
            </div>
            <div className="classic-col">
              <div className="classic-lead-wrapper clw-align-left">
                <div className="lead-block" data-ix="in-4-du">
                  <h2 className="heading">
                    Your daily moment of mindfulness and self-care
                  </h2>
                  <p className="paragraph">
                    No matter how busy you are, create a daily ritual for your
                    emotional health with tracks as short as{' '}
                    <strong className="bold-text">3 minutes</strong>, and up to
                    an hour.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
        <section className="cta-section">
          <div className="container-basic">
            <div className="cta-lead-block">
              <img
                src="/static/landingPageContent/images/aura-logo-alternate.png"
                alt="Aura Logo"
                srcSet="/static/landingPageContent/images/aura-logo-alternate-p-500.png 500w, /static/landingPageContent/images/aura-logo-alternate.png 614w"
                sizes="(max-width: 767px) 70px, 100px"
                className="cta-logo"
                data-ix="in-fade"
              />
              <h1 className="heading cta-headline" data-ix="in-4-du">
                Join millions who love Aura for emotional health &amp; sleep
              </h1>
              {renderCTA ? (
                renderCTA()
              ) : (
                <div
                  className="cta-buttons-wrapper cta-btn-wrp-hero"
                  data-ix="in-4-du">
                  <a
                    href="https://apps.apple.com/app/apple-store/id1114223104"
                    target="_blank"
                    rel="noreferrer"
                    className="cta-button w-inline-block">
                    <img
                      src="/static/landingPageContent/images/app-store-download.png"
                      alt=""
                      className="cta-dl-store-image"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.aurahealth"
                    target="_blank"
                    rel="noreferrer"
                    className="cta-button w-inline-block">
                    <img
                      src="/static/landingPageContent/images/google-play.png"
                      srcSet="/static/landingPageContent/images/google-play-p-500.png 500w, /static/landingPageContent/images/google-play.png 540w"
                      sizes="(max-width: 767px) 160px, 180px"
                      alt=""
                      className="cta-dl-store-image"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="cta-bg-image">
            <div className="hero-image-color-overlay" />
          </div>
        </section>
      </div>
    </div>
  );
}
