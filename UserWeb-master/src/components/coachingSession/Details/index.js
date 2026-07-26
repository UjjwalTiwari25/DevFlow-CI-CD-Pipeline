import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import useToastMessage from '@/hooks/toastMessage';
import { pollUserExists } from '@/models/user';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import Text from '../../app/Text';
import styles from './styles';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import AuraButton from '../../app/AuraButton';
import CleanLoginModal from '../../login/CleanLoginModal';

import useAuthUser from '../../../hooks/authUser';
import {
  createAppointmentAction,
  setAllowAppointment,
  setLoading,
} from '../../../store/slices/coaching';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import { getPricingDetail } from '../../../models/service';
import Loader from '../../app/Loader';
import ReviewClippedText from '../../app/ReviewClippedText';
import AvailabilityCard from './AvailabilityCard';

export default function Details({
  coach,
  onNext,
  onSubmitSignup,
  setIsReachEnd,
}) {
  const {
    coachService,
    sortedTimeSlots,
    selectedTime,
    allowAppointment,
    isLoading,
  } = useShallowEqualSelector(({ coaching }) => coaching);
  const { showError } = useToastMessage();
  const [, isMobile] = useResponsiveWindow();
  const dispatch = useDispatch();
  const [userSelectedTime, setUserSelectedTime] = useState(
    selectedTime ? format(new Date(selectedTime.start), 'h:mm a') : null
  );

  const { user, authLoading } = useAuthUser();
  const loginModalRef = useRef(null);
  const {
    title,
    description,
    rating,
    ratingCount,
    pricing,
    usedFor,
    benefits,
    reviews = [],
  } = coachService || {};
  const { bio, professionalTitle } = coach || {};

  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }

  async function setUserAppointment() {
    const res = await dispatch(
      createAppointmentAction({ time: userSelectedTime })
    ).unwrap();
    if (res && !res.error) {
      dispatch(setAllowAppointment(false));
      onNext();
    } else {
      showError('Failed to book appointment. Please try again.');
    }
  }

  async function onTimeSelect(time) {
    setUserSelectedTime(time);
  }

  async function onContinue() {
    if (!user) {
      showLoginModal();
    }
    if (user) {
      setUserAppointment();
    }
  }

  useEffect(() => {
    if (user && selectedTime && allowAppointment && sortedTimeSlots) {
      dispatch(setLoading(true));
      pollUserExists(user.id).then((result) => {
        if (result && !result.error) {
          setUserAppointment();
        }
      });
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="coach-row-info col align-center">
        <div
          className={
            isMobile ? 'col align-center' : 'row w-100 session-wrapper'
          }>
          <div className={`${isMobile && 'w-100 col align-center'}`}>
            <div className="coach-image-container">
              <img
                src={coach && coach.profileBgRemovedPicture}
                alt="coach"
                className="coach-image"
              />
            </div>
            <hr className="hr-2" />
          </div>
          <div className="col session-info">
            <Text
              type="h2-smaller"
              color="b100"
              weight="semibold"
              style={{ fontSize: !isMobile && 36 }}>
              {title}
            </Text>
            <Text
              type={isMobile ? 'body2' : 'cta'}
              color="b100"
              weight="regular"
              style={{ marginTop: 4 }}>
              by {getCoachName(coach)}
            </Text>
            {!!ratingCount && (
              <div className="row align-center star-container">
                <img
                  src="/static/images/coachingSession/star.png"
                  alt="aura"
                  className="single-star"
                />
                <Text type={isMobile ? 'body2' : 'cta'} color="b100">
                  {rating}
                </Text>
                <Text
                  type={isMobile ? 'body2' : 'cta'}
                  color="b64"
                  style={{ marginLeft: 6 }}>
                  ({ratingCount} reviews)
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="hr" />
      <div className="container row">
        <div className="coach-row-info-2 col">
          <Text
            type={isMobile ? 'body2' : 'cta'}
            color="g100"
            style={{
              lineHeight: isMobile ? '19px' : '26px',
              marginTop: isMobile ? 16 : 14,
            }}>
            {description}
          </Text>
          <div className="col icon-wrapper">
            <div className="row align-center icon-container">
              <img
                src="/static/images/coachingSession/user.png"
                alt="aura"
                className="icon"
              />
              <Text type={isMobile ? 'body2' : 'cta'} color="b64">
                1-1 Coaching
              </Text>
            </div>
            <div className="row align-center icon-container">
              <img
                src="/static/images/coachingSession/clock.png"
                alt="aura"
                className="icon"
              />
              <Text type={isMobile ? 'body2' : 'cta'} color="b64">
                {getPricingDetail(pricing, 'duration')}
              </Text>
            </div>
            <div className="row align-center icon-container">
              <img
                src="/static/images/coachingSession/zoom.png"
                alt="aura"
                className="icon"
              />
              <Text type={isMobile ? 'body2' : 'cta'} color="b64">
                Zoom
              </Text>
            </div>
          </div>
          {usedFor && (
            <>
              <Text
                type={isMobile ? 'cta' : 'h2-small'}
                color="g100"
                style={{ marginTop: 40 }}>
                Who is this for?
              </Text>
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color="g100"
                style={{
                  lineHeight: isMobile ? '19px' : '26px',
                  marginTop: isMobile ? 12 : 14,
                }}>
                {usedFor}
              </Text>
            </>
          )}
          {benefits && benefits.length && (
            <>
              <Text
                type={isMobile ? 'cta' : 'h2-small'}
                color="b100"
                style={{ marginTop: 40 }}>
                Benefits
              </Text>
              <Text
                type={isMobile ? 'body2' : 'cta'}
                color="g100"
                style={{
                  lineHeight: isMobile ? '19px' : '26px',
                  marginTop: isMobile ? 12 : 14,
                }}>
                {benefits.map((benefit) => (
                  <div key={benefit}>
                    <li>{benefit}</li>
                  </div>
                ))}
              </Text>
            </>
          )}
          <Text
            type={isMobile ? 'cta' : 'h2-small'}
            color="b100"
            style={{ marginTop: isMobile ? 40 : 60 }}>
            Your Coach
          </Text>
          <div className="coach-container row align-center">
            <img
              src={getCoachPhoto(coach)}
              alt="aura coach"
              className="coach-info-icon"
            />
            <div className="col">
              <Text
                type={isMobile ? 'cta' : 'h3-small'}
                color="b100"
                weight="semibold">
                {getCoachName(coach)}
              </Text>
              <Text
                type={isMobile ? 'body' : 'cta'}
                color={isMobile ? 'g50' : 'b100'}>
                {professionalTitle}
              </Text>
            </div>
          </div>
          <Text
            type={isMobile ? 'body2' : 'cta'}
            color="g100"
            style={{ lineHeight: isMobile ? '19px' : '26px', marginTop: 23 }}>
            {bio}
          </Text>
          {!!ratingCount && (
            <div className="review-container">
              <div className="row">
                <Text type={isMobile ? 'cta' : 'h2-small'} color="b100">
                  Reviews {rating}&nbsp;
                </Text>
                <Text type={isMobile ? 'cta' : 'h2-small'} color="b64">
                  ({ratingCount})
                </Text>
              </div>
              <div className="review-desktop w-100">
                {reviews.slice(0, 3).map((review) => {
                  const {
                    id,
                    rating: reviewRating,
                    feedback,
                    userName = '',
                    userPicture,
                    createdAt,
                  } = review;
                  const ratingArray = Array.from(
                    Array(Math.ceil(reviewRating)).keys()
                  );
                  return (
                    <div key={id}>
                      <div className="review-box">
                        <div className="row rating-line">
                          <div className="row">
                            {ratingArray.map((_, index) => (
                              <img
                                key={index}
                                src="/static/images/coachingSession/star.png"
                                alt="aura"
                                className="star"
                              />
                            ))}
                          </div>
                          <Text type="body" color="b40">
                            {format(new Date(createdAt), 'EEE, MMM dd')}
                          </Text>
                        </div>
                      </div>
                      <Text type="cta" color="g100">
                        {feedback}
                      </Text>
                      <div className="review-user-container row align-center">
                        {userPicture ? (
                          <img
                            src={userPicture}
                            alt="aura user"
                            className="user-icon"
                          />
                        ) : (
                          <div className="user-icon-text">
                            {userName.split('')[0]}
                          </div>
                        )}
                        <Text type="cta" weight="semibold" color="b100">
                          {userName}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="review-mobile">
                <img
                  src="/static/images/coachingSession/review-background.png"
                  alt="aurabackground"
                  className="review-background"
                />
                <CustomHorizontalScrollView
                  data={reviews.slice(0, 3)}
                  renderItem={(review) => {
                    const {
                      id,
                      rating: reviewRating,
                      feedback,
                      userName = '',
                      userPicture,
                    } = review;
                    const ratingArray = Array.from(
                      Array(Math.ceil(reviewRating)).keys()
                    );
                    return (
                      <div key={id} className="review-root col">
                        <div className="row stars-container">
                          {ratingArray.map((_, index) => (
                            <img
                              key={index}
                              src="/static/images/coachingSession/star.png"
                              alt="aura"
                              className="star"
                            />
                          ))}
                        </div>
                        <ReviewClippedText type="body" color="g100">
                          {feedback}
                        </ReviewClippedText>
                        <div className="user-info-wrapper">
                          <div className="review-user-container row align-center">
                            {!userPicture ? (
                              <img
                                src={userPicture}
                                alt="aura user"
                                className="user-icon"
                              />
                            ) : (
                              <div className="user-icon-text">
                                <Text type="body" color="g100">
                                  {userName.split('')[0]}
                                </Text>
                              </div>
                            )}
                            <Text type="cta" weight="semibold" color="b100">
                              {userName}
                            </Text>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
              {reviews && reviews.length > 5 && (
                <div className="desktop-only">
                  <Text
                    type="body"
                    color="b100"
                    style={{ textDecoration: 'underline', marginTop: 35 }}>
                    View all reviews
                  </Text>
                </div>
              )}
            </div>
          )}
          {coachService &&
            sortedTimeSlots &&
            Object.keys(sortedTimeSlots).length > 0 && (
              <div className="button-container mobile-only row align-center">
                <AuraButton
                  title="Next"
                  withShadow
                  cleanStyle
                  textWeight="bold"
                  style={{
                    width: '100%',
                    height: '55px',
                  }}
                  onClick={() => {
                    onNext();
                  }}
                />
              </div>
            )}
        </div>
        {coachService && (
          <AvailabilityCard
            onTimeSelect={onTimeSelect}
            onContinue={onContinue}
            setIsReachEnd={setIsReachEnd}
            userSelectedTime={userSelectedTime}
          />
        )}
        <CleanLoginModal
          ref={loginModalRef}
          isCoachingSession
          coach={coach}
          onSubmit={onSubmitSignup}
          loading={authLoading}
        />
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
