import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import useCountryDetails from '../../../../hooks/countryDetails';
import {
  getAvailableCoachingSpots,
  getCoachName,
  getCoachPhoto,
} from '../../../../models/coach';
import { getCountDisplayValue } from '../../../../utils';
import Text from '../../../app/Text';
import ClippedText from '../../../app/ClippedText';
import AuraButton from '../../../app/AuraButton';

import styles from './styles';
import TopCoachModal from '../TopCoachModal';
import AuraRingClean from '../../../app/AuraRingClean';
import Analytics from '../../../../services/Analytics';
import useAuthUser from '../../../../hooks/authUser';
import {
  checkoutSubscription,
  handleProcessSubscription,
  setCoach,
} from '../../../../store/slices/payment';
import Loader from '../../../app/Loader';
import { isUserCoachingSubscriber } from '../../../../models/user';
import useToastMessage from '../../../../hooks/toastMessage';

export default function CoachingCoachCard({
  coach,
  index,
  setShowAllCoaches,
  allCoaches,
  notNowIndex,
  handleNotNow,
  onNext,
  setCoachingSubscriptionDetails,
  disableButton,
  setDisableButton,
  isNewCoachingFlow,
  addScreen,
  experiments,
}) {
  const { countryDetails } = useCountryDetails(coach && coach.countryCode);
  const maxPlays = Math.max(coach.listenedCount, coach.playedCount);
  const [loading, setLoading] = useState(false);
  const coachModalRef = useRef();
  const dispatch = useDispatch();
  const { user } = useAuthUser();
  const { showError } = useToastMessage();
  function openModal() {
    if (coach && coachModalRef && coachModalRef.current) {
      Analytics.track('Onboarding Coaching Coach Profile Modal Viewed', {
        UserId: user.id,
        CoachName: coach.name,
        CoachId: coach.id,
        isNewCoachingFlow: true,
      });

      coachModalRef.current.show();
    }
  }
  function handleShowAllCoaches() {
    Analytics.track('Onboarding Coaching All Coaches Viewed', {
      UserId: user.id,
      isNewCoachingFlow: true,
    });
    setShowAllCoaches(true);
  }

  async function handleChooseCoach() {
    if (isNewCoachingFlow) {
      await dispatch(setCoach(coach));
      if (user) {
        Analytics.track('Onboarding Coaching Coach Selected', {
          UserId: user.id,
          CoachId: coach.id,
        });
        addScreen('bookCall', { previousScreen: 'topCoaches' });
        onNext();
      }
      return;
    }
    if (isUserCoachingSubscriber(user)) {
      showError(
        'You are already subscribed to 1-1 coaching. Please contact hello@aurahealth.io if you are having trouble accessing your account'
      );
      return;
    }
    if (loading) return;
    setLoading(true);
    setDisableButton(true);
    await dispatch(setCoach(coach));
    await dispatch(checkoutSubscription());
    const response = await dispatch(
      handleProcessSubscription({ isCoachingFreeTrial: true })
    ).unwrap();
    setLoading(false);
    if (!response.error) {
      await setCoachingSubscriptionDetails({
        coachId: coach?.id,
        isCoachingFreeTrial: true,
        type: 'coaching',
      });
      onNext({
        coachId: coach?.id,
        isCoachingFreeTrial: true,
        type: 'coaching',
      });
    } else {
      setDisableButton(false);
      showError('Failed to process subscription. Please try again');
    }
  }
  if (allCoaches) {
    return (
      <>
        {index < notNowIndex && (
          <div className="container-small">
            <div className="row">
              <img
                src={getCoachPhoto(coach)}
                alt="aura coach"
                className="coach-photo"
              />
              <div>
                <Text type="cta" color="b100">
                  {getCoachName(coach)}
                </Text>
                <Text type="footnote" color="b64" style={{ marginTop: 5 }}>
                  {coach && coach.professionalTitle}
                </Text>
                <div className="row align-center flag-container">
                  <img
                    src={countryDetails && countryDetails.imageUrl}
                    alt="aura flag"
                    className="country-flag-small"
                  />
                  <Text type="footnote" color="b64" align="center">
                    {countryDetails && countryDetails.displayName}
                  </Text>
                  <img
                    src="/static/images/familyPlan/subs.png"
                    alt="aura subs"
                    className="subs-icon"
                  />
                  <Text type="footnote" color="b64" align="center">
                    {`${getCountDisplayValue(coach && coach.followersCount)}`}
                  </Text>
                </div>
              </div>
            </div>
            <Text
              type="body2"
              color="b64"
              style={{ marginTop: 14, lineHeight: '15.83px' }}>
              <strong>Specialities: </strong>
              {coach && coach.specialties}
            </Text>
            <ClippedText
              type="body2"
              color="b64"
              style={{
                marginTop: 14,
                lineHeight: '19px',
              }}>
              {coach && coach.bio}
            </ClippedText>
            <AuraButton
              title="View Profile"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                marginTop: 15,
              }}
              onClick={() => {
                openModal();
              }}
              experiments={experiments}
            />
            <button
              className={classNames(
                'aura-btn with-shadow clean-style relative',
                {
                  disabled: disableButton,
                }
              )}
              onClick={() => {
                if (!loading && !disableButton) {
                  handleChooseCoach();
                }
              }}>
              {!loading ? (
                <>
                  <Text
                    color={'b100'}
                    type="body"
                    align="center"
                    style={{ textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)' }}>
                    Choose Coach
                  </Text>
                  <div className="spots">
                    <Text type="body2" color="b100">
                      {getAvailableCoachingSpots(coach)} spots left
                    </Text>
                  </div>
                </>
              ) : (
                <Loader size={22} />
              )}
            </button>
            {coach && index < notNowIndex && (
              <TopCoachModal
                ref={coachModalRef}
                coach={coach}
                countryDetails={countryDetails}
                handleChooseCoach={handleChooseCoach}
                disableButton={disableButton}
                isNewCoachingFlow={isNewCoachingFlow}
              />
            )}
          </div>
        )}
        {index === notNowIndex && (
          <div className="all-container-small col align-center">
            <AuraRingClean size={72} />
            <Text type="h4-large" color="b100" align="center">
              Still can’t find a coach?
            </Text>
            {isNewCoachingFlow ? (
              <Text
                type="body"
                color="b64"
                align="center"
                style={{ lineHeight: '20px', maxWidth: 220 }}>
                Start using Aura and choose a coach later.
              </Text>
            ) : (
              <Text
                type="body2"
                color="b64"
                align="center"
                style={{ lineHeight: '20px', maxWidth: 220 }}>
                Start using aura and choose a coach later, you wont be charged
              </Text>
            )}
            <img
              src="/static/images/familyPlan/coaches2.png"
              alt="aura coaches"
              className="coaches2"
            />
            <Text
              type="body2"
              color="b64"
              align="center"
              style={{ lineHeight: '20px', marginBottom: 14 }}>
              {`We’re adding more coaches`}
            </Text>
            <AuraButton
              title="Start using Aura without coaching"
              style={{
                width: '100%',
                marginBottom: 40,
                background: 'rgba(0,0,0,0.15)',
              }}
              onClick={() => {
                handleNotNow();
              }}
              experiments={experiments}
            />
          </div>
        )}
        <style jsx>{styles}</style>
      </>
    );
  }
  return (
    <>
      {index < 3 && (
        <div className="row w-100 justify-center">
          <div className="row align-center star-container">
            {index === 0 && (
              <img
                src="/static/images/familyPlan/star.png"
                alt="aura star"
                className="star"
              />
            )}
            {index > 0 && index < 3 && (
              <img
                src="/static/images/familyPlan/heart.png"
                alt="aura star"
                className="star invert"
              />
            )}
            <Text type="body2" color="b100">
              {index === 0 ? 'Best Match' : 'Popular'}
            </Text>
          </div>
        </div>
      )}
      <div className="w-100 container relative">
        {index < 3 && (
          <div className="coach-container col align-center">
            <div className="spots-header">
              <Text type="body2" color="b100">
                {getAvailableCoachingSpots(coach)} spots left
              </Text>
            </div>
            <div className="coach">
              <img
                src={getCoachPhoto(coach)}
                alt={coach && coach.name}
                className="coach-image"
              />
            </div>
            <hr className="hr" />
            <Text type="cta" color="b100" style={{ marginTop: 15 }}>
              {getCoachName(coach)}
            </Text>
            <Text
              type="body2"
              color="b100"
              align="center"
              style={{ marginTop: 11, minHeight: '28px' }}>
              {coach && coach.professionalTitle}
            </Text>
            <div className="row align-center flag-container">
              <img
                src={countryDetails && countryDetails.imageUrl}
                alt="aura flag"
                className="country-flag"
              />
              <Text type="body2" color="b100" align="center">
                {countryDetails && countryDetails.displayName}
              </Text>
            </div>
            <div className="row stats">
              <div className="col align-center">
                <Text type="body2" color="b64" align="center">
                  Followers
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{ marginTop: 5 }}>
                  {`${getCountDisplayValue(coach && coach.followersCount)}`}
                </Text>
              </div>
              <div className="col align-center">
                <Text type="body2" color="b64" align="center">
                  Plays
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{ marginTop: 5 }}>
                  {`${getCountDisplayValue(maxPlays)}`}
                </Text>
              </div>
              <div className="col align-center">
                <Text type="body2" color="b64" align="center">
                  Favorites
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{ marginTop: 5 }}>
                  {`${getCountDisplayValue(coach && coach.followersCount)}`}
                </Text>
              </div>
            </div>
            <Text
              type="body2"
              color="b64"
              align="left"
              style={{
                marginTop: 14,
                lineHeight: '15.83px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                width: '100%',
                minHeight: 32,
              }}>
              <strong>Specialities: </strong>
              {coach && coach.specialties}
            </Text>
            <Text
              type="body2"
              color="b64"
              style={{
                marginTop: 14,
                lineHeight: '19px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                marginBottom: 8,
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
              {coach && coach.bio}
            </Text>
            <AuraButton
              title="View Profile"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                marginTop: 11,
              }}
              onClick={() => {
                openModal();
              }}
              experiments={experiments}
            />
            <button
              className={classNames('aura-btn with-shadow clean-style', {
                disabled: disableButton,
              })}
              onClick={() => {
                if (!disableButton) {
                  handleChooseCoach();
                }
              }}>
              {!loading ? (
                <Text
                  color={'b100'}
                  type="body"
                  align="center"
                  style={{ textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)' }}>
                  Choose Coach
                </Text>
              ) : (
                <Loader size={22} />
              )}
            </button>
          </div>
        )}
        {index === 3 && (
          <div className="col all-container">
            <img
              src="/static/images/familyPlan/coaches.png"
              alt="aura coaches"
              className="coaches"
            />
            <Text type="h4-large" color="b100" align="center">
              Explore more coaches?
            </Text>
            <Text
              type="body2"
              color="b100"
              align="center"
              style={{ lineHeight: '20px', marginTop: 20, maxWidth: 248 }}>
              {isNewCoachingFlow
                ? 'We have many coaches with diverse backgrounds you can choose from.'
                : 'We have more coaches with diverse backgrounds that may better fit your needs'}
            </Text>
            <AuraButton
              title="Show all coaches"
              style={{
                width: '100%',
                marginTop: 37,
                background: 'rgba(0,0,0,0.15)',
              }}
              onClick={() => {
                handleShowAllCoaches();
              }}
              experiments={experiments}
            />
          </div>
        )}
        {coach && index < 3 && (
          <TopCoachModal
            ref={coachModalRef}
            coach={coach}
            countryDetails={countryDetails}
            handleChooseCoach={handleChooseCoach}
            disableButton={disableButton}
            isNewCoachingFlow={isNewCoachingFlow}
          />
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
