/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import celebritiesSlug from '@/utils/constants/celebrities';
import NewLandingPageStyle from '../NewLandingPageStyle';

const TYPE_KEY = {
  Masterclass: 'Masterclass',
  Meditation: 'Meditation',
  Story: 'Story',
  Hypnosis: 'Hypnosis',
  Coaching: 'Coaching',
  Therapy: 'Therapy',
  Prayer: 'Prayer',
  ASMR: 'ASMR',
  HealthCoaching: 'HealthCoaching',
  Breathwork: 'Breathwork',
  WorkWellness: 'WorkWellness',
  Music: 'Music',
  Sounds: 'Sounds',
};

const TYPE_LIST1 = [
  {
    key: 'Masterclass',
    title: 'Masterclass',
    icon: '/static/newLandingPageContent/images/Masterclass-Aura.svg',
    iconWhite: '/static/newLandingPageContent/images/Masterclass-Aurawh.svg',
  },
  {
    key: 'Meditation',
    title: 'Meditation',
    icon: '/static/newLandingPageContent/images/Meditation-Aura.svg',
    iconWhite: '/static/newLandingPageContent/images/Meditation-Aurawh.svg',
  },
  {
    key: 'Story',
    title: 'Story',
    icon: '/static/newLandingPageContent/images/Stories_1.svg',
    iconWhite: '/static/newLandingPageContent/images/Storieswh.svg',
  },
  {
    key: 'Hypnosis',
    title: 'Hypnosis',
    icon: '/static/newLandingPageContent/images/Hypnosis_1.svg',
    iconWhite: '/static/newLandingPageContent/images/Hypnosiswh.svg',
  },
  {
    key: 'Coaching',
    title: 'Coaching',
    icon: '/static/newLandingPageContent/images/Coaches.svg',
    iconWhite: '/static/newLandingPageContent/images/Coacheswht.png',
  },
  {
    key: 'Therapy',
    title: 'Therapy',
    icon: '/static/newLandingPageContent/images/CBT_1.svg',
    iconWhite: '/static/newLandingPageContent/images/CBTwh.svg',
  },
  {
    key: 'Prayer',
    title: 'Prayer',
    icon: '/static/newLandingPageContent/images/Prayg.svg',
    iconWhite: '/static/newLandingPageContent/images/Prayw.svg',
  },
];

const TYPE_LIST2 = [
  {
    key: 'ASMR',
    title: 'ASMR',
    icon: '/static/newLandingPageContent/images/ASMR.svg',
    iconWhite: '/static/newLandingPageContent/images/ASMRwh.svg',
  },
  {
    key: 'HealthCoaching',
    title: 'Health coaching',
    icon: '/static/newLandingPageContent/images/Group-5237.svg',
    iconWhite:
      '/static/newLandingPageContent/images/IconsHealthCoachingwhhh.svg',
  },
  {
    key: 'Breathwork',
    title: 'Breathwork',
    icon: '/static/newLandingPageContent/images/Breathwork_1.svg',
    iconWhite: '/static/newLandingPageContent/images/Breathworkwh.svg',
  },
  {
    key: 'WorkWellness',
    title: 'Work Wellness',
    icon: '/static/newLandingPageContent/images/WorkWellness.svg',
    iconWhite: '/static/newLandingPageContent/images/WorkWellnesswh.svg',
  },
  {
    key: 'Music',
    title: 'Music',
    icon: '/static/newLandingPageContent/images/Music_1.svg',
    iconWhite: '/static/newLandingPageContent/images/Musicwh.svg',
  },
  {
    key: 'Sounds',
    title: 'Sounds',
    icon: '/static/newLandingPageContent/images/Sounds_1.svg',
    iconWhite: '/static/newLandingPageContent/images/Soundswh.svg',
  },
];

function ContentTypes({
  onContinue,
  title,
  subTitle,
  addMasterClass,
  isCelebritieLandingPage,
  celebritieSlug,
}) {
  const [topicListOne, setTopicListOne] = useState([]);
  const [topicListTwo, setTopicListTwo] = useState([]);
  const [selectedType, setSelectedType] = useState(TYPE_LIST1[0].key);

  useEffect(() => {
    if (!addMasterClass) {
      TYPE_LIST1.shift();
    }
    setTopicListOne(TYPE_LIST1);
    setTopicListTwo(TYPE_LIST2);
    setSelectedType(TYPE_LIST1[0].key);
  }, [addMasterClass]);

  return (
    <>
      {isCelebritieLandingPage && <NewLandingPageStyle />}
      <div
        reordered-tabs="true"
        className={classNames('custom-sec best-sleep-sec wf-section', {
          'best-sleep-sec-celeb': isCelebritieLandingPage,
        })}>
        <div className="custom-con best-sleep-con">
          <h2
            className={classNames('best-sleep-title', {
              'best-sleep-title-celeb': isCelebritieLandingPage,
            })}>
            {title || `The best sleep of your life is just the start`}
          </h2>
          <p
            className={classNames('best-para', {
              'best-para-celeb': isCelebritieLandingPage,
            })}>
            {subTitle ||
              `From meditations to stories to cognitive behavioral therapy (CBT),
            find everything you need for your wellbeing in one app.`}
          </p>
          <div className="best-sleep-tab-block">
            <div
              data-current="Tab 9"
              data-easing="ease"
              data-duration-in="300"
              data-duration-out="100"
              className="player-tab-holder w-tabs">
              <div className="player-menu-block-new w-tab-menu">
                {topicListOne && (
                  <div className="two-row-block" key="row-one">
                    {topicListOne.map((typeItem) => (
                      <div
                        onClick={() => {
                          setSelectedType(typeItem.key);
                        }}
                        key={typeItem.key}
                        className={classNames(
                          'player-tab-list w-inline-block w-tab-link',
                          {
                            'w--current': selectedType === typeItem.key,
                            'player-tab-list-celeb': isCelebritieLandingPage,
                            'w--current-celeb':
                              selectedType === typeItem.key &&
                              isCelebritieLandingPage,
                          }
                        )}>
                        <div className="ele-flex">
                          <div className="player-tab-img">
                            {!isCelebritieLandingPage ? (
                              <Image
                                src={
                                  selectedType === typeItem.key
                                    ? typeItem.iconWhite
                                    : typeItem.icon
                                }
                                alt=""
                                className="sleep-gr-img-celeb"
                                fill
                              />
                            ) : (
                              <Image
                                fill
                                src={
                                  selectedType === typeItem.key
                                    ? typeItem.icon
                                    : typeItem.iconWhite
                                }
                                alt=""
                                className="sleep-gr-img-celeb"
                              />
                            )}
                          </div>
                          <div className="player-text">{typeItem.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {topicListTwo && (
                  <div className="two-row-block" key="row-two">
                    {topicListTwo.map((typeItem) => (
                      <div
                        onClick={() => {
                          setSelectedType(typeItem.key);
                        }}
                        key={typeItem.key}
                        className={classNames(
                          'player-tab-list w-inline-block w-tab-link',
                          {
                            'w--current': selectedType === typeItem.key,
                            'player-tab-list-celeb': isCelebritieLandingPage,
                            'w--current-celeb':
                              selectedType === typeItem.key &&
                              isCelebritieLandingPage,
                          }
                        )}>
                        <div className="ele-flex">
                          <div className="player-tab-img ">
                            {!isCelebritieLandingPage ? (
                              <Image
                                src={
                                  selectedType === typeItem.key
                                    ? typeItem.iconWhite
                                    : typeItem.icon
                                }
                                alt=""
                                className="sleep-gr-img-celeb"
                                fill
                              />
                            ) : (
                              <Image
                                fill
                                src={
                                  selectedType === typeItem.key
                                    ? typeItem.icon
                                    : typeItem.iconWhite
                                }
                                alt=""
                                className="sleep-gr-img-celeb"
                              />
                            )}
                          </div>
                          <div className="player-text">{typeItem.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="player-menu-content w-tab-content">
                {/* master class content new add */}
                {selectedType === TYPE_KEY.Masterclass && (
                  <div className="player-col w-tab-pane w--tab-active">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Aura Masterclass
                      </div>
                      <section className="popular-main">
                        <div className="custom-container">
                          <div className="popular-wrap-scroll">
                            <div className="popular-wrap">
                              {celebritieSlug !==
                                celebritiesSlug.ASHLEY_GREENE && (
                                <div className="popular-card">
                                  <Image
                                    height={220}
                                    width={320}
                                    src="/static/images/celebrities/popular-1.png"
                                    alt="popular-1"
                                  />
                                  <h2 className="popular-card-head">
                                    Aura X Ashley Greene
                                  </h2>
                                  <div className="popular-details">
                                    <p className="popular-text">
                                      Working with performance anxiety
                                    </p>
                                    <span className="popular-type">
                                      Actress
                                    </span>
                                  </div>
                                </div>
                              )}
                              {celebritieSlug !==
                                celebritiesSlug.GREG_LOUGANIS && (
                                <div className="popular-card">
                                  <Image
                                    height={220}
                                    width={320}
                                    src="/static/images/celebrities/popular-2.png"
                                    alt="popular-1"
                                  />
                                  <h2 className="popular-card-head">
                                    Aura X Greg Louganis
                                  </h2>
                                  <div className="popular-details">
                                    <p className="popular-text">
                                      Embracing my own identity
                                    </p>
                                    <span className="popular-type">
                                      4x Olympic Gold Medalist Diver
                                    </span>
                                  </div>
                                </div>
                              )}
                              {celebritieSlug !==
                                celebritiesSlug.MICHAEL_BEASLEY && (
                                <div className="popular-card">
                                  <Image
                                    height={220}
                                    width={320}
                                    src="/static/images/celebrities/popular-3.png"
                                    alt="popular-1"
                                  />
                                  <h2 className="popular-card-head">
                                    Aura X Michael Beasley
                                  </h2>
                                  <div className="popular-details">
                                    <p className="popular-text">
                                      Mental Health in the NBA
                                    </p>
                                    <span className="popular-type">
                                      former NBA player
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Meditation && (
                  <div className="player-col w-tab-pane w--tab-active">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Meditation
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26061a-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Mindfulness</div>
                              <div className="_18-bold-text mb-7">
                                Just Pause
                              </div>
                              <div className="_12-text">3 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarme1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Cindy Wolk-Weiss
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness Medit...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5442.png"
                              alt="flower-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-1m.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26062d-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Mindfulness</div>
                              <div className="_18-bold-text mb-7">
                                Nourishing Breathing
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatars4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Jiva Masheder
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness &amp; Self-...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5443.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-2m.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260640-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Mindfulness</div>
                              <div className="_18-bold-text mb-7">
                                Fall Asleep with Healing Energy
                              </div>
                              <div className="_12-text">9 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarme3.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Amy Kerman-...
                                </div>
                                <div className="_12-text-auth">
                                  Yoga &amp; Infinite...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5444.png"
                              alt="moon-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-3m.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260653-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Mindfulness</div>
                              <div className="_18-bold-text mb-7">
                                Comfort the Nervous System
                              </div>
                              <div className="_12-text">6 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarme4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Cass Carlopio
                                </div>
                                <div className="_12-text-auth">
                                  Sleep Expert
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5445.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-4m.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260666-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to
                                <br /> all tracks
                              </div>
                              <div className="_16-text">in Meditation</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Story && (
                  <div className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Story
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260679-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Story</div>
                              <div className="_18-bold-text mb-7">
                                Simon, the Mermaid and the Telescope
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatars4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Jiva Masheder
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness &amp; Self-...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5450.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/S-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26068c-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Story</div>
                              <div className="_18-bold-text mb-7">
                                Three Wishes...What Would You Choose?
                              </div>
                              <div className="_12-text">20 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/s2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Lisa Hopkins
                                </div>
                                <div className="_12-text-auth">
                                  Certified Professio...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5451.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/s-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26069f-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Story</div>
                              <div className="_18-bold-text mb-7">
                                As I Began to <br />
                                Love Myself
                              </div>
                              <div className="_12-text">7 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatars3.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dea Rivera
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness Teacher
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5452.png"
                              alt="flower-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/s-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2606b4-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Story</div>
                              <div className="_18-bold-text mb-7">
                                King Arthur&#x27;s <br />
                                Magic Trees
                              </div>
                              <div className="_12-text">32 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatars4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Jiva Masheder
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness &amp; Self-...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5453.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/s-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2606c9-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Story</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Hypnosis && (
                  <div className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Hypnosis
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2603e0-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Hypnosis</div>
                              <div className="_18-bold-text mb-7">
                                Manifest Your Goals Sleep Deep Tonight
                              </div>
                              <div className="_12-text">40 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarh1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dr. Liz Slonena
                                </div>
                                <div className="_12-text-auth">
                                  Mindful Hypnothera...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5454.png"
                              alt="crops-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/H-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2603f3-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Hypnosis</div>
                              <div className="_18-bold-text mb-7">
                                Complete Relaxation
                              </div>
                              <div className="_12-text">30 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarh2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Glenn Harrold
                                </div>
                                <div className="_12-text-auth">
                                  Hypnotherapist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5455.png"
                              alt="sunset-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/H-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260406-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Hypnosis</div>
                              <div className="_18-bold-text mb-7">
                                Manifest Deep Healing Sleep Every Night
                              </div>
                              <div className="_12-text">35 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarh1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dr. Liz Slonena
                                </div>
                                <div className="_12-text-auth">
                                  Mindful Hypnothera...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5477.png"
                              alt="background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/H-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260419-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Hypnosis</div>
                              <div className="_18-bold-text mb-7">
                                Binaural Weight Loss Hypnosis
                              </div>
                              <div className="_12-text">50 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarh2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Glenn Harrold
                                </div>
                                <div className="_12-text-auth">
                                  Hypnotherapist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5456.png"
                              alt="desert-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/H-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26042c-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Hypnosis</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Coaching && (
                  <div data-w-tab="Tab 12" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Coaching
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260733-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Life Coaching</div>
                              <div className="_18-bold-text mb-7">
                                No One Can Hurt You Unless You Allow It
                              </div>
                              <div className="_12-text">5 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarww2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dorothy Zennur...
                                </div>
                                <div className="_12-text-auth">
                                  Psychotherapist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5473.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/C-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260746-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Life Coaching</div>
                              <div className="_18-bold-text mb-7">
                                Love Notes To Myself
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarc2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dorothy Zennur...
                                </div>
                                <div className="_12-text-auth">
                                  Psychotherapist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5474.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/C-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260759-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Life Coaching</div>
                              <div className="_18-bold-text mb-7">
                                Change Your Habits, Change Your Life!
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarc3.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Britt Dirnberger
                                </div>
                                <div className="_12-text-auth">
                                  Habit Change Spe...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5475.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/C-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26076c-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Life Coaching</div>
                              <div className="_18-bold-text mb-7">
                                3 Life Practices to Guarantee Happiness
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarc2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dorothy Zennur...
                                </div>
                                <div className="_12-text-auth">
                                  Psychotherapist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5476.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/C-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26077f-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Coaching</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Therapy && (
                  <div data-w-tab="Tab 6" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Therapy
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260501-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Therapy</div>
                              <div className="_18-bold-text mb-7">
                                Changing Thought Habits
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatart1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Christine Mangum
                                </div>
                                <div className="_12-text-auth">
                                  Mental Health ...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5446.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/t-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260514-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Therapy</div>
                              <div className="_18-bold-text mb-7">
                                ABCDE Model Introduction
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarme4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Cass Carlopio
                                </div>
                                <div className="_12-text-auth">
                                  Sleep Expert
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5447.png"
                              alt="sky-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/t-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260527-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Therapy</div>
                              <div className="_18-bold-text mb-7">
                                How the Cycle of Anxiety Works
                              </div>
                              <div className="_12-text">8 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatart3.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Happiness Insight
                                </div>
                                <div className="_12-text-auth">
                                  Clinical Psychologists
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5448.png"
                              alt="background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/t-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26053a-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Therapy</div>
                              <div className="_18-bold-text mb-7">
                                How To Cope With Racing Thoughts
                              </div>
                              <div className="_12-text">13 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatart4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dr. Ryan C. War...
                                </div>
                                <div className="_12-text-auth">
                                  Clinical Psychologist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5449.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/t-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26054d-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Therapy</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Prayer && (
                  <div data-w-tab="Tab 1" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Prayer
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260322-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Prayer</div>
                              <div className="_18-bold-text mb-7">
                                Psalm 23 - The Lord is My Shepherd
                              </div>
                              <div className="_12-text">2 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarp1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Cassidy Sun
                                </div>
                                <div className="_12-text-auth">Storyteller</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5430.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/p-1.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260335-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Prayer</div>
                              <div className="_18-bold-text mb-7">
                                Christian Morning Prayer
                              </div>
                              <div className="_12-text">2 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarp2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Vanessa Michele
                                </div>
                                <div className="_12-text-auth">
                                  Yoga and Meditation
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5431.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/P-2.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260348-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Prayer</div>
                              <div className="_18-bold-text mb-7">
                                Evening Gratitude Prayer
                              </div>
                              <div className="_12-text">5 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarp3.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Myrene Dickinson
                                </div>
                                <div className="_12-text-auth">
                                  Health &amp; Behavior ...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5432.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/p-3.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26035b-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Prayer</div>
                              <div className="_18-bold-text mb-7">
                                Christian Prayer of Peace
                              </div>
                              <div className="_12-text">16 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarp4.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Erin Robertson
                                </div>
                                <div className="_12-text-auth">
                                  Story Narrator
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5433.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/p-4.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26036e-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in prayer</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.ASMR && (
                  <div data-w-tab="Tab 2" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in ASMR
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260381-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">ASMR</div>
                              <div className="_18-bold-text mb-7">
                                Brown Noise For Relaxation
                              </div>
                              <div className="_12-text">30 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Leon Riskin
                                </div>
                                <div className="_12-text-auth">
                                  Relaxation &amp; Sleep...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5438a1.png"
                              alt="ice-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/A-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260394-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">ASMR</div>
                              <div className="_18-bold-text mb-7">
                                Soundscape: In the Forest
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  California Soun...
                                </div>
                                <div className="_12-text-auth">Musician</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5439a2.png"
                              alt="trees-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/A-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2603a7-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">ASMR</div>
                              <div className="_18-bold-text mb-7">
                                Gentle Rain For Sleep
                              </div>
                              <div className="_12-text">20 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Reiki with Anna
                                </div>
                                <div className="_12-text-auth">
                                  Reiki Master
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5440a3.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/A-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2603ba-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">ASMR</div>
                              <div className="_18-bold-text mb-7">
                                Light Jingling Earrings For Sleep
                              </div>
                              <div className="_12-text">10 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Reiki with Anna
                                </div>
                                <div className="_12-text-auth">
                                  Reiki Master
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5441a3.png"
                              alt="plants-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/A-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2603cd-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in ASMR</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.HealthCoaching && (
                  <div data-w-tab="Tab 4" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Health coaching
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26043f-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">
                                Health coaching
                              </div>
                              <div className="_18-bold-text mb-7">
                                Emotional Eating
                              </div>
                              <div className="_12-text">6 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarhc1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Stel</div>
                                <div className="_12-text-auth">
                                  Body image and ...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5465.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/HC-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260452-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">
                                Health coaching
                              </div>
                              <div className="_18-bold-text mb-7">
                                The Dopamine <br />
                                Fast Alternative
                              </div>
                              <div className="_12-text">34 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarhc2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dawn-Elise Sni...
                                </div>
                                <div className="_12-text-auth">
                                  Clinical Psychoth...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5466.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/HC-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260467-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">
                                Health coaching
                              </div>
                              <div className="_18-bold-text mb-7">
                                Migraine Triggers And Living With Them
                              </div>
                              <div className="_12-text">42 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarhc2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Dawn-Elise Sni...
                                </div>
                                <div className="_12-text-auth">
                                  Clinical Psychoth...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5467.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/hc-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26047a-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">
                                Health coaching
                              </div>
                              <div className="_18-bold-text mb-7">
                                Visualize Your <br />
                                Goal
                              </div>
                              <div className="_12-text">4- mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarhc3.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Christina &amp; Darrin
                                </div>
                                <div className="_12-text-auth">
                                  Love Coach &amp; The...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5468.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/hc-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26048f-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Health coaching</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Breathwork && (
                  <div data-w-tab="Tab 5" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Breathwork
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2604a2-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Breathwork</div>
                              <div className="_18-bold-text mb-7">
                                Relax Before Bed
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarhc1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Stel</div>
                                <div className="_12-text-auth">
                                  Body image and ...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5434.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/B-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2604b5-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Breathwork</div>
                              <div className="_18-bold-text mb-7">
                                Breathwork Practice
                              </div>
                              <div className="_12-text">8 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Anjanette Todd
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness Coach
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5435.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/B-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2604c8-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Breathwork</div>
                              <div className="_18-bold-text mb-7">
                                Breathing Meditation with Counting
                              </div>
                              <div className="_12-text">3 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Carla-Jo Geraghty
                                </div>
                                <div className="_12-text-auth">
                                  Mindfulness Teacher
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5436.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/B-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2604db-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Breathwork</div>
                              <div className="_18-bold-text mb-7">
                                Extend The Exhale To Activate Calm
                              </div>
                              <div className="_12-text">5 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Cass Carlopio
                                </div>
                                <div className="_12-text-auth">
                                  Sleep Expert
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5437.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/b-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2604ee-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Breathwork</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.WorkWellness && (
                  <div data-w-tab="Tab 7" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Work Wellness
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260560-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Work Wellness</div>
                              <div className="_18-bold-text mb-7">
                                Your North Star
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarww1.png"
                                alt=""
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Paul Corke
                                </div>
                                <div className="_12-text-auth">
                                  Leadership Innov...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5457.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/W-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260573-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Work Wellness</div>
                              <div className="_18-bold-text mb-7">
                                How to Develop Your Career
                              </div>
                              <div className="_12-text">5 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarww1.png"
                                alt=""
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Paul Corke
                                </div>
                                <div className="_12-text-auth">
                                  Leadership Innov...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5458.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/w-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260586-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Work Wellness</div>
                              <div className="_18-bold-text mb-7">
                                Your Career Anchors
                              </div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarww1.png"
                                alt=""
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Paul Corke
                                </div>
                                <div className="_12-text-auth">
                                  Leadership Innov...
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5459.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/w-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260599-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Work Wellness</div>
                              <div className="_18-bold-text mb-7">
                                Boost Of Confidence
                              </div>
                              <div className="_12-text">6= mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatara1.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  yogacatamar
                                </div>
                                <div className="_12-text-auth">
                                  Yoga Teacher
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5460.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/w-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2605ac-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Work Wellness</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Music && (
                  <div data-w-tab="Tab 8" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Music
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2605bf-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Music</div>
                              <div className="_18-bold-text mb-7">
                                Weightlessness Sound Bath For Hypnagogia
                              </div>
                              <div className="_12-text">57 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarm1.png"
                                alt="avatarm-logo"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Healing Vibrat...
                                </div>
                                <div className="_12-text-auth">
                                  Sound Healing Artist
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5469.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-1.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2605d2-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Music</div>
                              <div className="_18-bold-text mb-7">Facile</div>
                              <div className="_12-text">4 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Logo-Rainbow-Thin-1-1.png"
                                alt="aura_ring"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Aura</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5470.png"
                              alt="flowers-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-2.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2605e3-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Music</div>
                              <div className="_18-bold-text mb-7">Rest</div>
                              <div className="_12-text">5 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Logo-Rainbow-Thin-1-1.png"
                                alt="aura_ring"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Aura</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5471.png"
                              alt="sunset_background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-3.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2605f4-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Music</div>
                              <div className="_18-bold-text mb-7">
                                Alchemy Sound Bath For Meditative Sleep
                              </div>
                              <div className="_12-text">63 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Avatarm2.png"
                                alt="profile-image"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">
                                  Nila Ellison
                                </div>
                                <div className="_12-text-auth">
                                  Wellness Coach
                                </div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5472.png"
                              alt="sky_background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/m-4.png"
                            alt="graident-background"
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260607-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to
                                <br /> all tracks
                              </div>
                              <div className="_16-text">in Music</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === TYPE_KEY.Sounds && (
                  <div data-w-tab="Tab 11" className="player-col w-tab-pane">
                    <div className="player-col-holder">
                      <div
                        className={classNames('most-title', {
                          'most-title-celeb': isCelebritieLandingPage,
                        })}>
                        Most popular in Sounds
                      </div>
                      <div className="popular-col">
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2606dc-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Soundscape</div>
                              <div className="_18-bold-text mb-7">
                                Soft Rain
                              </div>
                              <div className="_12-text">60 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Logo-Rainbow-Thin-1-1.png"
                                alt="aura_ring"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Aura</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5461.png"
                              alt="rain-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5237.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2606ed-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Soundscape</div>
                              <div className="_18-bold-text mb-7">
                                Rain and Thunder
                              </div>
                              <div className="_12-text">60 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Logo-Rainbow-Thin-1-1.png"
                                alt="aura_ring"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Aura</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5462.png"
                              alt="thunder-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/2_1.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be2606fe-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Soundscape</div>
                              <div className="_18-bold-text mb-7">
                                Blissful Sounds
                              </div>
                              <div className="_12-text">60 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Logo-Rainbow-Thin-1-1.png"
                                alt="aura_ring"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Aura</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5463.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/3_1.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be26070f-4a13af8c"
                            className="pop-col">
                            <div className="trans-col">
                              <div className="_12-text mb-7">Soundscape</div>
                              <div className="_18-bold-text mb-7">
                                Medium Rain
                              </div>
                              <div className="_12-text">60 mins</div>
                            </div>
                            <div className="author-col">
                              <Image
                                height={30}
                                width={30}
                                src="/static/newLandingPageContent/images/Logo-Rainbow-Thin-1-1.png"
                                alt="aura_ring"
                                className="auth-img"
                              />
                              <div className="auth-content-col">
                                <div className="_14-bold-text mb-1">Aura</div>
                              </div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/Group-5464.png"
                              alt="graident-background"
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/4_1.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                        <div className="pop-card-holder">
                          <div
                            id="w-node-_4f8fe9b0-d009-72a4-2549-0195be260720-4a13af8c"
                            className="pop-col blue-card">
                            <div className="trans-col">
                              <div className="_18-bold-text mb-7">
                                Get access to <br />
                                all tracks
                              </div>
                              <div className="_16-text">in Sounds</div>
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroundBlur1.svg"
                              alt=""
                              className="pop-bg-color"
                            />
                            <div
                              onClick={onContinue}
                              className="start-btn w-button">
                              {isCelebritieLandingPage ? `Sign Up` : `Continue`}
                            </div>
                            <Image
                              fill
                              src="/static/newLandingPageContent/images/BackgroudImage5.png"
                              alt=""
                              className="slide-card-image"
                            />
                          </div>
                          <Image
                            height={230}
                            width={180}
                            src="/static/newLandingPageContent/images/Group-5239.png"
                            alt=""
                            className="card-overlay-bg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-embed"></div>
      </div>
    </>
  );
}

export default ContentTypes;
