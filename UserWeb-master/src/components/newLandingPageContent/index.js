/* eslint-disable react/no-unknown-property */
import Router from 'next/router';
import React from 'react';
import CoachesAndTrackSlider from './CoachesAndTrackSlider';
import CoachListSlider from './CoachListSlider';
import AuraStatistics from './AuraStatistics';
import Reviews from './Reviews';
import ContentTypes from './ContentTypes';

export default function NewLandingPageContent({
  hideCoachAndTrackSlider,
  onContinueClick,
}) {
  const onContinue = () => {
    if (typeof onContinueClick === 'function') {
      onContinueClick();
    } else {
      Router.push('https://www.aurahealth.io/signup');
    }
  };

  return (
    <div className="wrapper-page">
      {/* coach Image slide? */}

      {!hideCoachAndTrackSlider && <CoachesAndTrackSlider />}
      {/* featured on */}
      <section className="section-logos wf-section">
        <div className="block__grid-logos" data-ix="in-fade-delayed-load">
          <img
            src="/static/newLandingPageContent/images/best.svg"
            alt="Best of 2017 Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/Time_Magazine_logo.svg"
            alt="Time Magazine Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/logos-omagazine.svg"
            alt="Tech Crunch Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/NBC_logo.svg"
            alt="Tech Crunch Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/Cnet-logo-red-2020.svg"
            alt="Tech Crunch Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/techcrunch-vector-logo.svg"
            alt="Tech Crunch Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/Forbes_logo.svg"
            alt="Forbes Magazine Logo"
            className="image__logo-small"
          />
          <img
            src="/static/newLandingPageContent/images/logo.svg"
            alt="Mindful Magazine Logo"
            className="image__logo-small"
          />
        </div>
      </section>

      {/* Find peace every day */}
      <section
        data-w-id="98233994-e29f-ca3f-5ccf-c95dafd6af01"
        className="section-app sec-meet wf-section">
        <div className="content__grid-app">
          <div
            id="w-node-_98233994-e29f-ca3f-5ccf-c95dafd6af03-4a13af8c"
            className="block__text-app">
            <h2 className="h2__36 h2_title-left-small">
              Find peace every day with one app for your whole well-being.
            </h2>
            <p
              data-w-id="98233994-e29f-ca3f-5ccf-c95dafd6af04"
              className="p__18">
              There is no one-size-fits-all solution to mental well-being. Aura
              is the first all-in-one wellness app that learns how to best help
              you.
              <br />
              <br />
              Discover an endless library of expert-created tracks for your
              well-being, all taught by the world’s best coaches, therapists,
              and storytellers. <br />
              <br />
              With Aura&#x27;s personalized recommendations, you can find peace
              every morning, day and night.
            </p>
          </div>
          <div className="block__image-app">
            <div
              data-w-id="bc769933-8293-ee2a-50fe-18ed72c47433"
              className="app__bg"></div>
            <div className="scale-075">
              <div
                data-w-id="bc769933-8293-ee2a-50fe-18ed72c47434"
                className="app0-1">
                <img
                  src="/static/newLandingPageContent/images/app-aura-2-1.png"
                  loading="lazy"
                  height=""
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 75vw, (max-width: 991px) 45vw, 513.75px"
                  srcSet="/static/newLandingPageContent/images/app-aura-2-1-p-500.png 500w, /static/newLandingPageContent/images/app-aura-2-1.png 685w"
                  alt=""
                  className="img__app21"
                />
              </div>
              <div
                data-w-id="bc769933-8293-ee2a-50fe-18ed72c47435"
                className="app0-2">
                <img
                  src="/static/newLandingPageContent/images/app-aura-2-2.png"
                  loading="lazy"
                  alt=""
                  className="image-14"
                />
              </div>
              <div
                data-w-id="b68917fe-383a-4c94-4f14-3d699548597b"
                className="app0-3">
                <img
                  src="/static/newLandingPageContent/images/app-aura-2-3.png"
                  loading="lazy"
                  height=""
                  alt=""
                  className="image-14"
                />
              </div>
              <div className="app_mockup app0">
                <img
                  src="/static/newLandingPageContent/images/1.-Home.png"
                  loading="lazy"
                  height=""
                  alt="Aura Health - App"
                  className="app-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-w-id="8ab1d4f9-1ea8-b57a-d4f7-d541a8b80658"
        className="section-sleep wf-section">
        <div className="bg_app-sleep">
          <div className="content__small _700 margin-bottom">
            <h2 className="h2__36 center light-text">
              Get the sleep &amp; rest you deserve.
            </h2>
            <p className="p__22 light-text">
              Lack of quality sleep can affect your mind and body in ways that
              carry over into your daily life. Fall asleep faster and wake up
              rejuvenated with Aura’s sleep tracks personalized just for you.
            </p>
          </div>
          <div
            data-w-id="4a7001c6-c5c0-5ba9-aca5-ac7b65bacec9"
            className="slider_cards-sleep">
            <div className="row_cards-sleep">
              <div
                data-w-id="e3348b61-8f74-837e-1e65-cc89b38dbfa8"
                className="card-sleep-2">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Music</div>
                  <div className="text_card-title">Sweet Dreams</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _002">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">Night Time Drive</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/tom-avatar.png"
                    loading="lazy"
                    alt="tom-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Tom Ward</p>
                    <p className="p__review-aura light-text">Storyteller</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _003">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">
                    Binaural Deep Sleep Hypnosis
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/glenn-avatar.png"
                    loading="lazy"
                    alt="glenn-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Glenn Harrold</p>
                    <p className="p__review-aura light-text">Hypnotherapist</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _004">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Meditation</div>
                  <div className="text_card-title">Drift Off to Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/cass-avatar_1.png"
                    loading="lazy"
                    alt="cass-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Cass Carlopio</p>
                    <p className="p__review-aura light-text">
                      Sleep Expert &amp; Psychologist
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _005">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Rain on Rooftop</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _011">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Meditation</div>
                  <div className="text_card-title">
                    The Magical Forest Sleep Meditation
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/jordana-avatar.png"
                    loading="lazy"
                    alt="jordana-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Jordana Reim</p>
                    <p className="p__review-aura light-text">
                      Author &amp; Meditation Guide
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _012">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">A Magical Ride</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/ed-avatar.png"
                    loading="lazy"
                    alt="ed-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Ed Roche</p>
                    <p className="p__review-aura light-text">
                      Bedtime Stories Narrator
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _013">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Deep Restorative Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/stacey-avatar.png"
                    loading="lazy"
                    alt="stacey-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Stacey Henry-Carr</p>
                    <p className="p__review-aura light-text">Hypnotherapist</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row_cards-sleep">
              <div className="card-sleep-2">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Music</div>
                  <div className="text_card-title">Sweet Dreams</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _002">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">Night Time Drive</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/tom-avatar.png"
                    loading="lazy"
                    alt="tom-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Tom Ward</p>
                    <p className="p__review-aura light-text">Storyteller</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _003">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">
                    Binaural Deep Sleep Hypnosis
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/glenn-avatar.png"
                    loading="lazy"
                    alt="glenn-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Glenn Harrold</p>
                    <p className="p__review-aura light-text">Hypnotherapist</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _004">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Meditation</div>
                  <div className="text_card-title">Drift Off to Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/cass-avatar_1.png"
                    loading="lazy"
                    alt="cass-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Cass Carlopio</p>
                    <p className="p__review-aura light-text">
                      Sleep Expert &amp; Psychologist
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _005">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Rain on Rooftop</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _011">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Meditation</div>
                  <div className="text_card-title">
                    The Magical Forest Sleep Meditation
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/jordana-avatar.png"
                    loading="lazy"
                    alt="jordana-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Jordana Reim</p>
                    <p className="p__review-aura light-text">
                      Author &amp; Meditation Guide
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _012">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">A Magical Ride</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/ed-avatar.png"
                    loading="lazy"
                    alt="ed-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Ed Roche</p>
                    <p className="p__review-aura light-text">
                      Bedtime Stories Narrator
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _013">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Deep Restorative Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/stacey-avatar.png"
                    loading="lazy"
                    alt="stacey-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Stacey Henry-Carr</p>
                    <p className="p__review-aura light-text">Hypnotherapist</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row_cards-sleep">
              <div className="card-sleep-2">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Music</div>
                  <div className="text_card-title">Sweet Dreams</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _002">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">Night Time Drive</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/tom-avatar.png"
                    loading="lazy"
                    alt="tom-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Tom Ward</p>
                    <p className="p__review-aura light-text">Storyteller</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _003">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">
                    Binaural Deep Sleep Hypnosis
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/glenn-avatar.png"
                    loading="lazy"
                    alt="glenn-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Glenn Harrold</p>
                    <p className="p__review-aura light-text">Hypnotherapist</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _004">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Meditation</div>
                  <div className="text_card-title">Drift Off to Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/cass-avatar_1.png"
                    loading="lazy"
                    alt="cass-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Cass Carlopio</p>
                    <p className="p__review-aura light-text">
                      Sleep Expert &amp; Psychologist
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _005">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Rain on Rooftop</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _011">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Meditation</div>
                  <div className="text_card-title">
                    The Magical Forest Sleep Meditation
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/jordana-avatar.png"
                    loading="lazy"
                    alt="jordana-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Jordana Reim</p>
                    <p className="p__review-aura light-text">
                      Author &amp; Meditation Guide
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _012">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">A Magical Ride</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/ed-avatar.png"
                    loading="lazy"
                    alt="ed-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Ed Roche</p>
                    <p className="p__review-aura light-text">
                      Bedtime Stories Narrator
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _013">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Deep Restorative Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/stacey-avatar.png"
                    loading="lazy"
                    alt="stacey-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Stacey Henry-Carr</p>
                    <p className="p__review-aura light-text">Hypnotherapist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-w-id="fefc7338-c7d6-7570-aa0f-c715a35e45c1"
            className="slider_cards-sleep">
            <div className="row_cards-sleep">
              <div className="card-sleep-2 _006">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Music</div>
                  <div className="text_card-title">
                    Serenity Sleep Meditation
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/katie-avatar.png"
                    loading="lazy"
                    alt="katie-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Katie Krimitsos</p>
                    <p className="p__review-aura light-text">
                      Creator: Womrne’s Meditation Network
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _007">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">The Magic Swan</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/jiva-avatar_1.png"
                    loading="lazy"
                    alt="jiva-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Jiva Masheder</p>
                    <p className="p__review-aura light-text">
                      Mindfulness &amp; Self-Compassion Teacher
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _008">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Calming Sea</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _009">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Journey into Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/dorothy-avatar_1.png"
                    loading="lazy"
                    alt="dorothy-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Dorothy Ratusny</p>
                    <p className="p__review-aura light-text">Psychotherapist</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _010">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Lullaby For My Baby</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _014">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">The Magic Bon Bons</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/christine-avatar.png"
                    loading="lazy"
                    alt="christine-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Christine Mangum</p>
                    <p className="p__review-aura light-text">
                      Mental Health Counselor
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _015">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Forest</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row_cards-sleep">
              <div className="card-sleep-2 _006">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Music</div>
                  <div className="text_card-title">
                    Serenity Sleep Meditation
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/katie-avatar.png"
                    loading="lazy"
                    alt="katie-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Katie Krimitsos</p>
                    <p className="p__review-aura light-text">
                      Creator: Womrne’s Meditation Network
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _007">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">The Magic Swan</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/jiva-avatar_1.png"
                    loading="lazy"
                    alt="jiva-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Jiva Masheder</p>
                    <p className="p__review-aura light-text">
                      Mindfulness &amp; Self-Compassion Teacher
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _008">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Calming Sea</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _009">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Journey into Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/dorothy-avatar_1.png"
                    loading="lazy"
                    alt="dorothy-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Dorothy Ratusny</p>
                    <p className="p__review-aura light-text">Psychotherapist</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _010">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Lullaby For My Baby</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _014">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">The Magic Bon Bons</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/christine-avatar.png"
                    loading="lazy"
                    alt="christine-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Christine Mangum</p>
                    <p className="p__review-aura light-text">
                      Mental Health Counselor
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _015">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Forest</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row_cards-sleep">
              <div className="card-sleep-2 _006">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Music</div>
                  <div className="text_card-title">
                    Serenity Sleep Meditation
                  </div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/katie-avatar.png"
                    loading="lazy"
                    alt="katie-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Katie Krimitsos</p>
                    <p className="p__review-aura light-text">
                      Creator: Womrne’s Meditation Network
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _007">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">The Magic Swan</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/jiva-avatar_1.png"
                    loading="lazy"
                    alt="jiva-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Jiva Masheder</p>
                    <p className="p__review-aura light-text">
                      Mindfulness &amp; Self-Compassion Teacher
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _008">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Calming Sea</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _009">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Hypnosis</div>
                  <div className="text_card-title">Journey into Sleep</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/dorothy-avatar_1.png"
                    loading="lazy"
                    alt="dorothy-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Dorothy Ratusny</p>
                    <p className="p__review-aura light-text">Psychotherapist</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _010">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Lullaby For My Baby</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _014">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Story</div>
                  <div className="text_card-title">The Magic Bon Bons</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/christine-avatar.png"
                    loading="lazy"
                    alt="christine-profile-image"
                    className="avatar-author _32px"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Christine Mangum</p>
                    <p className="p__review-aura light-text">
                      Mental Health Counselor
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-sleep-2 _015">
                <div className="text_card-sleep">
                  <div className="text_card-cat">Soundscapes</div>
                  <div className="text_card-title">Forest</div>
                </div>
                <div className="block_author-review line-top">
                  <img
                    src="/static/newLandingPageContent/images/aura-avatar.png"
                    loading="lazy"
                    alt="Aura - All-In-One App for Emotional Health &amp; Sleep"
                    className="avatar-author"
                  />
                  <div className="block_card-author">
                    <p className="p__card-author">Aura</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="block_button-sleep _40-top">
            <div
              onClick={onContinue}
              className="btn__primary-signup glow w-button">
              Continue
            </div>
          </div>
        </div>
        <div className="css_bg-blendmode w-embed"></div>
      </section>

      <div className="for-below-ani"></div>
      <ContentTypes onContinue={onContinue} />

      {/* coach list */}

      <CoachListSlider />

      <section
        data-w-id="67c15ca2-3210-43fb-517f-c7b23526d916"
        className="section-app wf-section">
        <div className="content__small _500 mb60n">
          <h2 className="h2__36 center">How it works:</h2>
        </div>
        <div className="content__grid-app how-it-work-grid">
          <div
            id="w-node-_67c15ca2-3210-43fb-517f-c7b23526d918-4a13af8c"
            className="block__text-app">
            <h3 className="h3__26">1. Take the quiz</h3>
            <p className="p__18">
              Tell us about your unique needs and interests. Whether it’s
              something to help you fall asleep or an immersive meditation
              course, Aura has you covered.
            </p>
          </div>
          <div className="block__image-app">
            <div className="scale-075">
              <div
                data-w-id="7d45f51b-95d7-6637-26c1-4c63acb92b61"
                className="app1-1">
                <div className="app3__card-sleep">
                  <div>Sleep</div>
                </div>
              </div>
              <div
                data-w-id="2c2ba62d-f51a-ce7d-59d1-eb4cf13313e9"
                className="app1-2">
                <div className="app3__card-hapiness">
                  <div>Happiness</div>
                </div>
              </div>
              <div
                data-w-id="3e431738-2dd7-c24e-f0f1-68a3f14f60cf"
                className="app1-3">
                <div className="app3__card-text">
                  <div>Age 35</div>
                </div>
              </div>
              <div
                data-w-id="627170ca-d9c1-ae36-1b4d-966d6c312401"
                className="app1-4">
                <div className="app3__card-text">
                  <div>Female</div>
                </div>
              </div>
              <div
                data-w-id="5e7e4b58-c431-a854-3e5d-92c1604731e4"
                className="app1-5">
                <div className="app3__card-text">
                  <div>Prefer short tracks</div>
                </div>
              </div>
              <div className="app_mockup app1">
                <img
                  src="/static/newLandingPageContent/images/2.-Questionnaire.png"
                  loading="lazy"
                  height=""
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 256.96875px, (max-width: 991px) 344.25px, 418.5px"
                  srcSet="/static/newLandingPageContent/images/2.-Questionnaire-p-500.png 500w, /static/newLandingPageContent/images/2.-Questionnaire.png 558w"
                  alt="Aura Health - App"
                  className="app-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        data-w-id="915d9704-97c9-afb9-ab50-b7a63f10ab3f"
        className="section-app wf-section">
        <div className="content__grid-app how-it-work-grid">
          <div
            id="w-node-_915d9704-97c9-afb9-ab50-b7a63f10ab48-4a13af8c"
            className="block__text-app">
            <h3 className="h3__26">
              2. <strong>Enjoy personalized tracks</strong>
            </h3>
            <p className="p__18">
              Aura uses billions of data points and thousands of tracks to
              create personalized recommendations for you.
            </p>
          </div>
          <div className="block__image-app">
            <div className="app__bg _2"></div>
            <div className="scale-075">
              <div
                data-w-id="023634a4-79a0-5158-6506-190f7f768268"
                className="app2-1">
                <img
                  src="/static/newLandingPageContent/images/app-aura-4-1.png"
                  loading="lazy"
                  alt=""
                  className="app4-experience"
                />
              </div>
              <div
                data-w-id="dabab065-f858-9d67-947c-f593319e240a"
                className="app2-2">
                <div className="item__card-coaches dorothy-ratusny _22">
                  <div className="bg-gradient-darkbottom">
                    <div className="scaledown-07">
                      <div className="block__card-coach-name">
                        <img
                          src="/static/newLandingPageContent/images/flag-ca.png"
                          loading="lazy"
                          alt="Canada Flag"
                          className="flag__card-coaches"
                        />
                        <div className="text__card-coach-name">
                          Dorothy Ratusny
                        </div>
                      </div>
                      <div className="text__card-coach-title">
                        Holistic Psychotherapist
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-w-id="6a5ff927-4076-b88d-d202-4f6b1b68fabf"
                className="app2-3">
                <img
                  src="/static/newLandingPageContent/images/app-aura-4-4.png"
                  loading="lazy"
                  alt=""
                  className="image-21"
                />
              </div>
              <div className="app_mockup app2">
                <img
                  src="/static/newLandingPageContent/images/app-aura-4-2.png"
                  loading="lazy"
                  height=""
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 256.51171875px, (max-width: 991px) 344.25px, 417.75px"
                  srcSet="/static/newLandingPageContent/images/app-aura-4-2-p-500.png 500w, /static/newLandingPageContent/images/app-aura-4-2.png 557w"
                  alt=""
                  className="app-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-w-id="5b8e0b83-6b7f-bfb1-2524-cce7f6b24872"
        className="section-app wf-section">
        <div className="content__grid-app how-it-work-grid">
          <div
            id="w-node-_5b8e0b83-6b7f-bfb1-2524-cce7f6b24874-4a13af8c"
            className="block__text-app">
            <h3 className="h3__26">
              3. <strong>Find peace, and make Aura yours even more</strong>
            </h3>
            <p className="p__18">
              Explore new content, find your favorite coaches, and build new
              playlists. Aura continuously improves its personalized
              recommendations for you.
            </p>
            <div className="block-40top _002">
              <div
                onClick={onContinue}
                className="btn__primary-signup glow w-button">
                Continue
              </div>
            </div>
          </div>
          <div className="block__image-app">
            <div
              data-w-id="25d284f0-7308-262b-724e-4ebd9048de2d"
              className="app__bg"></div>
            <div className="scale-075">
              <div
                data-w-id="b4aa42ee-6778-5d9f-2462-f23d4524ccd9"
                className="app3-1">
                <div className="item__card-coaches cass-carlopio _31">
                  <div className="bg-gradient-darkbottom">
                    <div className="scaledown-07">
                      <div className="block__card-coach-name">
                        <img
                          src="/static/newLandingPageContent/images/flag-au.png"
                          loading="lazy"
                          alt="Australia Flag"
                          className="flag__card-coaches"
                        />
                        <div className="text__card-coach-name">
                          Cass Carlopio
                        </div>
                      </div>
                      <div className="text__card-coach-title">
                        Sleep Expert &amp; Psychologist
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-w-id="3df374dd-c7c2-a13f-45d3-9b7d3a6a74ca"
                className="app3-2">
                <div className="item__card-feature app32">
                  <div>
                    <div className="text__card-feature _32">13 tracks</div>
                    <div>
                      Medidation
                      <br />
                      playlist
                    </div>
                  </div>
                  <div>by You</div>
                </div>
              </div>
              <div
                data-w-id="9cff1dfb-2422-092e-55d7-73e675a98c38"
                className="app3-3">
                <div className="item__card-feature hypnosis _33">
                  <img
                    src="/static/newLandingPageContent/images/Hypnosis.svg"
                    loading="lazy"
                    alt="Aura - Hypnosys"
                    className="icon__card-featured"
                  />
                  <div className="text__card-feature _33">Hypnosis</div>
                </div>
              </div>
              <div
                data-w-id="7c708862-7aeb-37ad-4c33-ef9d47e47c2a"
                className="app3-4">
                <div className="item__card-feature cbt _34">
                  <img
                    src="/static/newLandingPageContent/images/CBT.svg"
                    loading="lazy"
                    alt="Aura - CBT"
                    className="icon__card-featured"
                  />
                  <div className="text__card-feature _34">
                    Cognitive Behavioral Therapy
                  </div>
                </div>
              </div>
              <div className="app_mockup app3">
                <img
                  src="/static/newLandingPageContent/images/app-aura-5-0.png"
                  loading="lazy"
                  height=""
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 256.51171875px, (max-width: 991px) 344.25px, 417.75px"
                  srcSet="/static/newLandingPageContent/images/app-aura-5-0-p-500.png 500w, /static/newLandingPageContent/images/app-aura-5-0.png 557w"
                  alt="Aura Health - App"
                  className="app-image"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="block-40top _003">
          <div
            onClick={onContinue}
            className="btn__primary-signup glow w-button">
            Continue
          </div>
        </div>
      </section>

      <AuraStatistics onContinue={onContinue} />

      <Reviews />

      <section className="section-press wf-section">
        <div className="block__subtitle">
          <div className="content__medium">
            <h2 className="h2__36">Press</h2>
          </div>
        </div>
        <div className="block__slider-press">
          <div
            data-delay="5000"
            data-animation="slide"
            className="slider__press w-slider"
            data-autoplay="true"
            data-easing="ease-in-out"
            data-hide-arrows="false"
            data-disable-swipe="false"
            data-autoplay-limit="0"
            data-nav-spacing="3"
            data-duration="1000"
            data-infinite="true">
            <div className="slider__mask-press w-slider-mask">
              <div className="slide__press w-slide">
                <div className="block__card-press">
                  <p className="p__18">
                    “It’s no wonder Aura has earned a nearly five-star rating on
                    the App Store out of 16,000 reviews and was voted Best of
                    2017”
                  </p>
                  <img
                    src="/static/newLandingPageContent/images/huffpost-logo.png"
                    loading="lazy"
                    alt="Huffpost Logo"
                    className="image__logo-press"
                  />
                </div>
              </div>
              <div className="slide__press w-slide">
                <div className="block__card-press">
                  <p className="p__18">
                    “Named the No. 1 New App by Apple, the AI-powered program
                    uses questionnaires to personalize and improve the user
                    experience.”
                  </p>
                  <img
                    src="/static/newLandingPageContent/images/thenewyorktimes-logo.png"
                    loading="lazy"
                    alt="The New York Times Logo"
                    className="image__logo-press"
                  />
                </div>
              </div>
              <div className="slide__press w-slide">
                <div className="block__card-press">
                  <p className="p__22">
                    “Just stop reading and download this app.”
                  </p>
                  <img
                    src="/static/newLandingPageContent/images/oprah-logo.png"
                    loading="lazy"
                    alt="Oprah Logo"
                    className="image__logo-press"
                  />
                </div>
              </div>
              <div className="slide__press w-slide">
                <div className="block__card-press">
                  <p className="p__18">
                    “If Siri was hardcore about meditation, then that&#x27;s
                    exactly what Aura is.”
                  </p>
                  <img
                    src="/static/newLandingPageContent/images/refinary29-logo.png"
                    loading="lazy"
                    alt="Refinary29 Logo"
                    className="image__logo-press"
                  />
                </div>
              </div>
              <div className="slide__press w-slide">
                <div className="block__card-press">
                  <p className="p__18">
                    &quot;Aura is the &#x27;Spotify of mindfulness&#x27;,
                    offering personalized meditations as short as three minutes
                    per day, making it an easy addition to your daily
                    routine.&quot;
                  </p>
                  <img
                    src="/static/newLandingPageContent/images/travelleisure-logo.png"
                    loading="lazy"
                    alt="Travel Leisure Logo"
                    className="image__logo-press"
                  />
                </div>
              </div>
              <div className="slide__press w-slide">
                <div className="block__card-press">
                  <p className="p__18">
                    &quot;Those who are new to meditation, or those who are
                    looking for top-notch guided sessions, Aura is our one of
                    our favorites.”
                  </p>
                  <img
                    src="/static/newLandingPageContent/images/cnn-logo.png"
                    loading="lazy"
                    alt="CNN Logo"
                    className="image__logo-press"
                  />
                </div>
              </div>
            </div>
            <div className="slider__sidenav-press w-slider-arrow-left">
              <div className="icon__slider-press w-icon-slider-left"></div>
            </div>
            <div className="slider__sidenav-press w-slider-arrow-right">
              <div className="icon__slider-press w-icon-slider-right"></div>
            </div>
            <div className="slider__bottomnav-press w-slider-nav w-round"></div>
          </div>
        </div>
        <div className="scroll__press">
          <div className="block__scroll-press">
            <div className="block__card-press">
              <p className="p__18">
                “It’s no wonder Aura has earned a nearly five-star rating on the
                App Store out of 16,000 reviews and was voted Best of 2017”
              </p>
              <img
                src="/static/newLandingPageContent/images/huffpost-logo.png"
                loading="lazy"
                alt="Huffpost Logo"
                className="image__logo-press"
              />
            </div>
            <div className="block__card-press">
              <p className="p__18">
                “Named the No. 1 New App by Apple, the AI-powered program uses
                questionnaires to personalize and improve the user experience.”
              </p>
              <img
                src="/static/newLandingPageContent/images/thenewyorktimes-logo.png"
                loading="lazy"
                alt="The New York Times Logo"
                className="image__logo-press"
              />
            </div>
            <div className="block__card-press">
              <p className="p__22">
                “Just stop reading and download this app.”
              </p>
              <img
                src="/static/newLandingPageContent/images/oprah-logo.png"
                loading="lazy"
                alt="Oprah Logo"
                className="image__logo-press"
              />
            </div>
            <div className="block__card-press">
              <p className="p__18">
                “If Siri was hardcore about meditation, then that&#x27;s exactly
                what Aura is.”
              </p>
              <img
                src="/static/newLandingPageContent/images/refinary29-logo.png"
                loading="lazy"
                alt="Refinary29 Logo"
                className="image__logo-press"
              />
            </div>
            <div className="block__card-press">
              <p className="p__18">
                &quot;Aura is the &#x27;Spotify of mindfulness&#x27;, offering
                personalized meditations as short as three minutes per day,
                making it an easy addition to your daily routine.&quot;
              </p>
              <img
                src="/static/newLandingPageContent/images/travelleisure-logo.png"
                loading="lazy"
                alt="Travel Leisure Logo"
                className="image__logo-press"
              />
            </div>
            <div className="block__card-press">
              <p className="p__18">
                &quot;Those who are new to meditation, or those who are looking
                for top-notch guided sessions, Aura is our one of our
                favorites.”
              </p>
              <img
                src="/static/newLandingPageContent/images/cnn-logo.png"
                loading="lazy"
                alt="CNN Logo"
                className="image__logo-press"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section-cta2 wf-section">
        <div className="content__small _700">
          <img
            src="/static/newLandingPageContent/images/circle-aurahealth.png"
            loading="lazy"
            alt=""
            className="image-25"
          />
          <h2 className="h2__36 center">
            With Aura, you can find the key to rest, peace, and happiness inside
            you.
          </h2>
          <div className="block-40top">
            <div
              onClick={onContinue}
              className="btn__primary-signup glow w-button">
              Continue
            </div>
          </div>
        </div>
      </section>

      <link
        href="https://aura-health-code.pages.dev/tab-content/styles.css"
        rel="stylesheet"
      />
    </div>
  );
}
