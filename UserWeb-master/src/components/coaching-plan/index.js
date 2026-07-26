import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import styles from './styles';
import useAuthUser from '../../hooks/authUser';
import usePageQuery from '../../hooks/pageQuery';
import { getPersonalizedFeedTopics } from '../../models/user';
import routeConstants from '../../utils/constants/routes';
import pricingConstants from '../../utils/constants/pricing';
import AuraRingClean from '../app/AuraRingClean';
import Text from '../app/Text';
import AuraButtonSecondary from '../app/AuraButtonSecondary';
import { generateQueryPath } from '../../utils';
import UserSelection from './UserSelection';
import UserTestimonial from './UserTestimonial';
import PersonalizedPlan from './PersonalizedPlan';
import useTrackPageView from '../../hooks/trackPageView';

const YOUR_PLAN_ROW = ['personalizedPlan', 'userSelection', 'userTestimonial'];

const COMPONENT_FOR_ROW = {
  personalizedPlan: PersonalizedPlan,
  userSelection: UserSelection,
  userTestimonial: UserTestimonial,
};

function CoachingPlan({ coach }) {
  const container = useRef(null);
  const { user } = useAuthUser();
  const [personalizedTopics, setPersonalizedTopics] = useState(null);
  const {
    utm_source = null,
    utm_campaign = null,
    redirectTo = null,
    sentFrom = null,
    userId = null,
    utm_medium = null,
    utm_content = null,
    type = null,
  } = usePageQuery();
  const { name } = coach || {};
  useTrackPageView({ CoachID: coach.id, 'Coach Name': name }, [coach]);

  useEffect(() => {
    if (user) {
      const { personalizedActiveFeed, personalizedInactiveFeed } =
        getPersonalizedFeedTopics(user);
      setPersonalizedTopics([
        ...(personalizedActiveFeed || []),
        ...(personalizedInactiveFeed || []),
      ]);
    }
  }, [user]);

  function handleClick() {
    const coachingPricing = pricingConstants.PRICING_COACHING_FULL;
    Router.push(
      generateQueryPath(`${routeConstants.PAGE_SUBSCRIBE}/${coachingPricing}`, {
        utm_source,
        utm_campaign,
        redirectTo,
        sentFrom,
        userId,
        utm_medium,
        utm_content,
        coachId: coach.id,
        type,
      })
    );
  }

  let header = 'Welcome!';
  if (user && user.givenName) {
    header = `Hey ${user.givenName},`;
  }
  return (
    <>
      <div ref={container} className="container">
        <div className="your-plan-item">
          <AuraRingClean style={{ marginTop: 4, marginLeft: -14 }} />
          <Text
            color="b80"
            type="h3-large"
            component="h1"
            weight="regular"
            align="left"
            style={{
              marginTop: 16,
            }}>
            {header}
          </Text>
          <Text
            color="b80"
            type="h3-large"
            weight="regular"
            align="left"
            style={{
              marginTop: 8,
              marginBottom: 24,
            }}>
            We have some great stuff for you!
          </Text>
        </div>

        <div className="plan-items-container">
          {YOUR_PLAN_ROW.map((key) => {
            const Component = COMPONENT_FOR_ROW[key];
            return (
              <Component
                personalizedTopics={personalizedTopics}
                key={key}
                className="your-plan-item"
                user={user}
                isYourPlan2={true}
                coach={coach}
              />
            );
          })}
        </div>
        <AuraButtonSecondary
          loading={false}
          style={{
            minWidth: 210,
            position: 'fixed',
            bottom: 40,
            alignSelf: 'center',
            zIndex: 2,
          }}
          title="Continue"
          onClick={handleClick}
          classes="aura-btn"
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

export default CoachingPlan;
