import React, { useEffect } from 'react';
import useTheme, { THEMES } from '@/hooks/theme';
import styles from './styles';
import useBrowserHistory from '../../../../hooks/browserHistory';
import useAuthUser from '../../../../hooks/authUser';
import Analytics from '../../../../services/Analytics';
import Text from '../../../app/Text';
import AuraButton from '../../../app/AuraButton';
import HowItWorks from '../NewCoachingFlowComponents/HowItWorks';

export default function NewCoachingFlow({
  addScreen,
  removeScreen,
  onNext,
  onBack,
  experiments,
}) {
  useBrowserHistory('newCoachingFlow', true, onBack, onNext);
  const { user } = useAuthUser();
  useTheme(THEMES.DARK);

  useEffect(() => {
    if (user) {
      Analytics.track('Onboarding Coaching Page Viewed', {
        UserId: user.id,
      });
    }
  }, [user]);

  function handleNotNow() {
    if (user) {
      Analytics.track('Onboarding Coaching Free Trial Skipped', {
        UserId: user.id,
        isNewCoachingFlow: true,
      });
      removeScreen('topCoaches');
      onNext();
    }
  }

  function handleNext() {
    if (!user) return;
    if (user) {
      addScreen('topCoaches', { previousScreen: 'newCoachingFlow' });
      Analytics.track('Onboarding Coaching Free Trial Clicked', {
        UserId: user.id,
        isNewCoachingFlow: true,
      });
      onNext();
    }
  }

  return (
    <div className="col align-center main-wrapper">
      <div className="col align-center main">
        <div className="aura-premium-button">
          <Text type="footnote" weight="bold" color="b100">
            Aura Premium exclusive offer
          </Text>
        </div>
        <Text
          type="cta"
          align="center"
          weight="semibold"
          style={{
            background: 'linear-gradient(to right, #47CF9E, #9DD400, #AAE10C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            marginBottom: 32,
          }}>
          Claim the free 1-1 coaching discovery call included with your
          subscription
        </Text>
        <Text type="h3" color="b100" align="center" weight="600">
          See How it works
        </Text>
        <HowItWorks
          index={1}
          title="Meet your coach & set goals together"
          subtitle="Start with a live, 30-min onboarding call with your coach to share & set your goals together.">
          <div className="meet-coach">
            <img
              src="/static/images/newCoachingFlow/mobile-frame.png"
              alt="aura"
              className="mobile-frame"
            />
            <img
              src="/static/images/newCoachingFlow/mobile-frame-coach.png"
              alt="aura"
              className="mobile-frame-coach"
            />
            <div className="mobile-frame-header">
              <img
                src="/static/images/newCoachingFlow/mobile-frame-header.png"
                alt="aura"
                className="mobile-frame-header-image"
              />
              <div className="black-background" />
            </div>
            <div className="user-block">
              <img
                src="/static/images/newCoachingFlow/mobile-frame-user.png"
                alt="aura user"
                className="user-avatar"
              />
              <Text type="body2" weight="semibold" color="b100">
                {user && user.givenName}
              </Text>
            </div>
          </div>
        </HowItWorks>
        <HowItWorks
          index={2}
          title="Daily, unlimited access to 1-on-1 personal coaching."
          subtitle="Receive personalized coaching through daily messages; the coach is always there for you.">
          <div className="weekly-recomendation">
            <div className="row">
              <img
                src="/static/images/joinlist/cass.png"
                alt="aura coach"
                className="coach-image"
              />
              <div className="chat-box-right">
                <Text type="body2" color="b100" style={{ lineHeight: '19px' }}>
                  How are you doing with your goals this week?
                </Text>
              </div>
            </div>
            <div className="w-100 row justify-end">
              <div className="chat-box-left">
                <Text type="body2" color="b100" style={{ lineHeight: '19px' }}>
                  I’m having trouble calming my anxiety before work. Can you
                  talk me through how I should approach this?
                </Text>
              </div>
            </div>
            <div className="row margin-above">
              <img
                src="/static/images/joinlist/cass.png"
                alt="aura coach"
                className="coach-image"
              />
              <img
                src="/static/images/newCoachingFlow/chat.png"
                alt="aura chat"
                className="coach-chat"
              />
            </div>
          </div>
        </HowItWorks>
        <HowItWorks
          index={3}
          title="Receive weekly personalized recommendations for your goals"
          subtitle="Your coach will create a personalized plan based on your goals so you can grow faster.">
          <div className="recomendation-container">
            <div className="row">
              <img
                src="/static/images/joinlist/cass.png"
                alt="aura coach"
                className="coach-image"
              />
              <div className="chat-box-right fix-height">
                <Text type="body2" color="b100" style={{ lineHeight: '19px' }}>
                  {` I’m going to share Aura Tracks, articles, videos, podcasts and
                  more for your goals.`}
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  style={{
                    lineHeight: '19px',
                    marginTop: 16,
                    marginBottom: 12,
                  }}>
                  Try these this week!
                </Text>
                <div className="row absolute">
                  <div className="aura-track col align-center">
                    <Text
                      type="footnote-small"
                      color="b100"
                      style={{ marginTop: 18 }}>
                      Story
                    </Text>
                    <Text
                      type="body2"
                      weight="bold"
                      color="b100"
                      style={{ marginTop: 8 }}>
                      Find Peace
                    </Text>
                    <Text type="footnote" color="b100" style={{ marginTop: 6 }}>
                      3 or 7 min
                    </Text>
                    <div className="absolute position">
                      <div className="row align-center">
                        <img
                          src="/static/images/joinlist/cass.png"
                          alt="aura coach"
                          className="coach-image-small"
                        />
                        <div>
                          <Text type="footnote" weight="bold" color="b100">
                            Cass Carlopio
                          </Text>
                          <Text type="footnote-small" color="b64">
                            Meditation Coach
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/static/images/newCoachingFlow/medium-article.png"
                    alt="aura article"
                    className="article"
                  />
                </div>
              </div>
            </div>
          </div>
        </HowItWorks>
        <HowItWorks
          index={4}
          title="Track your data and reach your goals faster."
          subtitle="Set goals together, discuss your health trends, and improve your overall well-being. Exprience data-driven coaching to reach you goals faster.">
          <div className="tracking">
            <img
              src="/static/images/newCoachingFlow/tracking.png"
              alt="tracking"
              className="tracking-image"
            />
          </div>
        </HowItWorks>
      </div>

      <div className="lower-button w-100 col align-center">
        <AuraButton
          cleanStyle
          withShadow
          textWeight="bold"
          title={'Choose my coach'}
          style={{
            width: '90%',
            height: '65px',
            borderRadius: 99,
            marginBottom: 18,
          }}
          textStyle={{
            fontSize: 20,
            textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
          }}
          onClick={() => {
            handleNext();
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
            color="b100"
            align="center"
            style={{ textDecoration: 'underline' }}>
            Not Now
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
