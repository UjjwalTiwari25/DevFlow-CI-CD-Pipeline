import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuthUser from '../../../../hooks/authUser';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import { getPersonalizedFeedTopics } from '../../../../models/user';
import Analytics from '../../../../services/Analytics';
import { setTrialFee } from '../../../../store/slices/payment';
import AuraButton from '../../../app/AuraButton';
import CustomHorizontalScrollView from '../../../app/CustomHorizontalScroll';
import Text from '../../../app/Text';
import CoachCard from '../CoachCard';
import CoachSlider from '../CoachSlider';
import ReviewCard from '../ReviewCard';
import styles from './styles';

const howItWorksValues = [
  {
    title: 'Meet your coach & set goals together',
    desc: 'Start with a live, 30-min onboarding call with your coach to share your needs and set goals together',
  },
  {
    title: 'Receive weekly recommendations & track progress',
    desc: 'Your coach will create a personalized plan based on your needs. You can share your progress each week and adjust your plan',
  },
  {
    title: 'Message your coach whenever you need',
    desc: 'Get daily coaching & guidance when you need it through messaging. No appointment necessary.',
  },
];
const coaches = [
  '/static/images/joinlist/coaches/cass.png',
  '/static/images/joinlist/coaches/dorothy.png',
  '/static/images/joinlist/coaches/glen.png',
  '/static/images/joinlist/coaches/lauren.png',
  '/static/images/joinlist/coaches/karuna.png',
  '/static/images/joinlist/coaches/last.png',
];
export default function JoinWaitListExtended({
  valueProps,
  handleJoinList,
  handleNotNow,
  experiments,
}) {
  const { user } = useAuthUser();
  const [hideButton, setHideButton] = useState(false);
  const [topics, setTopics] = useState(null);
  const bodyRef = useRef();
  const dispatch = useDispatch();
  const { trialFee } = useShallowEqualSelector(({ payment }) => payment);
  const handleScroll = useCallback(() => {
    if (bodyRef && bodyRef.current) {
      const { scrollHeight } = bodyRef.current;
      if (window.innerHeight + window.pageYOffset > scrollHeight) {
        setHideButton(true);
        Analytics.track('Join Coaching Wait List End Reached', {
          UserId: user && user.id,
        });
      } else {
        setHideButton(false);
      }
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (user) {
      const { personalizedActiveFeed } = getPersonalizedFeedTopics(user);
      if (personalizedActiveFeed && personalizedActiveFeed.length > 0) {
        setTopics(personalizedActiveFeed);
      }
    }
  }, [user]);

  useEffect(() => {
    dispatch(setTrialFee(null));
  }, [dispatch]);

  return (
    <div className="col align-center wrapper" ref={bodyRef}>
      <Text
        type="body"
        color="b100"
        align="center"
        style={{ maxWidth: 277, lineHeight: '19.49px' }}>
        Based on your answers, we will offer free 1-1 coaching!
      </Text>
      <hr className="hr" />
      <div className="row justify-center align-center spot-button">
        <Text
          type="footnote"
          weight="semibold"
          color="b100"
          align="center"
          style={{ lineHeight: '14.62px', marginTop: 1 }}>
          Try for {trialFee ? `$${trialFee / 100}` : 'free'}
        </Text>
      </div>
      <Text
        type="h4-large"
        weight="semibold"
        color="b100"
        align="center"
        style={{ lineHeight: '24.36px', maxWidth: 270 }}>
        Reach your goals faster with 1-1 coaching from the world’s best coaches
      </Text>
      <Text
        type="body"
        align="center"
        weight="semibold"
        style={{
          background: 'linear-gradient(to right, #47CF9E, #9DD400, #AAE10C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          marginTop: 4,
        }}>
        {trialFee ? '' : 'Free '}Trial included with premium
      </Text>
      <div className="box topics-container">
        <div className="row justify-center">
          <Text
            type="body2"
            color="b100"
            align="center"
            style={{
              marginTop: 17,
              marginBottom: 20,
              lineHeight: '17.05px',
              maxWidth: 292,
            }}>
            Based on your answers, we have coaches who can significantly improve
            these areas in your life:{' '}
            {topics &&
              topics.length > 0 &&
              `${topics[0].topicKeyword}, ${topics[1].topicKeyword}, ${topics[2].topicKeyword}, `}{' '}
            and more
          </Text>
        </div>
        <div className="row topics-wrapper">
          {topics &&
            topics.slice(0, 3).map((topic) => (
              <div
                key={topic.title}
                className="relative topic row align-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${
                    topic.backgroundImage || topic.img.uri
                  })`,
                }}>
                <img
                  src="/static/images/joinlist/topic-cross.png"
                  alt="aura"
                  className="cross"
                />
                <div
                  className="topic-shadow"
                  style={{
                    backgroundImage: `url(${
                      topic.backgroundImage || topic.img.uri
                    })`,
                  }}></div>
                <div className="row align-center justify-center">
                  <Text
                    color="b100"
                    align="center"
                    weight="bold"
                    type="body2"
                    style={{ lineHeight: '14px' }}>
                    {topic.topicKeyword}
                  </Text>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Text color="b100" align="center" weight="regular" type="cta">
        Features
      </Text>
      <CoachSlider />
      <Text
        color="b100"
        align="center"
        weight="regular"
        type="cta"
        style={{ marginTop: 40, marginBottom: 8 }}>
        How it works
      </Text>
      {howItWorksValues.map((value, index) => (
        <div className="value-box row relative" key={index}>
          <div className="index-shadow position-index"></div>
          <div className="index row align-center justify-center">
            <Text
              type="body"
              color="b100"
              weight="bold"
              align="center"
              style={{
                width: 30,
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {index + 1}
            </Text>
          </div>
          <div>
            <Text type="body" color="b100" weight="semibold">
              {value.title}
            </Text>
            <Text
              color="b64"
              weight="semibold"
              style={{
                fontSize: '13px',
                lineHeight: '17.55px',
                marginTop: 2,
              }}>
              {value.desc}
            </Text>
          </div>
        </div>
      ))}
      <Text
        color="b100"
        align="center"
        weight="regular"
        type="cta"
        style={{ marginTop: 22, marginBottom: 14 }}>
        Our Coaches
      </Text>
      <div className="row coaches-container">
        <CustomHorizontalScrollView
          data={coaches}
          renderItem={(coach) => <CoachCard coach={coach} />}
        />
      </div>
      <Text
        color="b100"
        align="center"
        weight="regular"
        type="cta"
        style={{ marginTop: 40, marginBottom: 14 }}>
        The fastest and most effective way to reach your goals
      </Text>
      <div className="box graph-container relative">
        <Text
          type="footnote"
          weight="semibold"
          color="b40"
          style={{ position: 'absolute', top: 48, left: 41, maxWidth: 130 }}>
          {topics &&
            topics.length > 0 &&
            `(${topics[0].title}, ${topics[1].title}, ${topics[2].title})`}
        </Text>
        <img
          src="/static/images/joinlist/graph.png"
          className="graph"
          alt="sleep graph"
        />
        <hr className="hr" />
        <Text
          type="body2"
          color="b100"
          align="center"
          style={{ marginTop: 16 }}>
          Our members show significant increase in sleep while using 1-1
          coaching
        </Text>
      </div>
      <Text
        color="b100"
        align="center"
        weight="regular"
        type="cta"
        style={{ marginTop: 30, marginBottom: 20 }}>
        Member Reviews
      </Text>
      <ReviewCard />
      <Text
        color="b100"
        align="center"
        weight="semibold"
        type="h4-large"
        style={{ marginTop: 22, marginBottom: 2 }}>
        Your Membership
      </Text>
      <Text
        color="b100"
        align="center"
        weight="regular"
        type="cta"
        style={{ marginBottom: 20 }}>
        Join Waitlist
      </Text>
      <div className={classNames('col align-center box')}>
        <div className={classNames('col align-center')}>
          <div className="row-wrapper">
            {valueProps.map((value) => (
              <div key={value.icon} className="row row-main">
                <img src={value.icon} alt="aura icon" className="value-icon" />
                <Text type="body2" color="b100">
                  {value.text}
                </Text>
              </div>
            ))}
          </div>
          <div className="hr-container">
            <hr className="hr-2" />
          </div>
        </div>
        <div className="row align-center">
          <img
            src="/static/images/auraScore/greenCheck.png"
            alt="aura check"
            className="green-check"
            style={{ marginLeft: trialFee ? -16 : 0 }}
          />
          <Text
            type="body2"
            align="left"
            weight="semibold"
            style={{
              background:
                'linear-gradient(to right, #47CF9E, #9DD400, #AAE10C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              marginTop: 4,
              marginLeft: -3,
            }}>
            7-day {trialFee ? '' : 'free '}trial{' '}
            {trialFee ? `just for $${trialFee / 100}` : ''}
          </Text>
        </div>
        <Text type="body2" color="b64" align="center">
          {' Free trial, then only $149/mo if you continue.'}
        </Text>
        <Text
          type="body2"
          color="b64"
          align="center"
          style={{ marginTop: 6, maxWidth: 310 }}>
          Join the waitlist and we will reach out when spots open up.
        </Text>
        <AuraButton
          cleanStyle
          withShadow
          textWeight="bold"
          title="Join Waitlist"
          style={{
            width: '90%',
            height: '65px',
            borderRadius: 99,
            marginBottom: 28,
            marginTop: 32,
          }}
          onClick={() => {
            handleJoinList();
          }}
          experiments={experiments}
        />
        <div
          className="clickable"
          onClick={() => {
            handleNotNow();
          }}>
          <Text
            type="body"
            color="b64"
            align="center"
            style={{ textDecoration: 'underline', marginBottom: 30 }}>
            Not Now
          </Text>
        </div>
      </div>
      {!hideButton && (
        <div className="lower-button w-100 col align-center">
          <AuraButton
            cleanStyle
            withShadow
            textWeight="bold"
            title="Join Waitlist"
            style={{
              width: '90%',
              height: '65px',
              borderRadius: 99,
              marginBottom: 18,
            }}
            onClick={() => {
              handleJoinList();
            }}
            experiments={experiments}
          />
          <div
            className="clickable"
            onClick={() => {
              handleNotNow();
            }}>
            <Text
              type="body"
              color="b64"
              align="center"
              style={{ textDecoration: 'underline' }}>
              Not Now
            </Text>
          </div>
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
