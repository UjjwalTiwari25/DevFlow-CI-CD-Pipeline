import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import {
  getAvailableCoachingSpots,
  getCoachFirstName,
  getCoachName,
  getCoachPhoto,
} from '../../../models/coach';
import AuraButton from '../../app/AuraButton';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import Text from '../../app/Text';
import Footer from '../Footer';
import CoachingSessions from '../CoachingSessions';
import styles from './styles';
import { handleBookCoachingCTA } from '../../../store/slices/coaching';
import JoinWaitListButton from '../JoinWaitListButton';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';

function Coaching({ coach, allServices, isMobile, scrollPosition }) {
  const { specialties = [] } = coach;
  const dispatch = useDispatch();
  const { currentScrollPosition } = useShallowEqualSelector(
    ({ profiles }) => profiles
  );

  useEffect(() => {
    if (currentScrollPosition > 0 && allServices) {
      window.scrollTo(0, currentScrollPosition);
    }
  }, [currentScrollPosition, allServices]);

  return (
    <div className={`col align-center w-100 main`}>
      <img
        src="/static/images/newCoach/coachingMobileBackground.png"
        alt="aura background"
        className="mobile-background"
      />
      <div className="heading">
        <Text
          type="h1-large"
          color="b100"
          weight="regular"
          style={{ marginBottom: 24 }}>
          Coaching
        </Text>
      </div>
      <div className="speciality-wrapper">
        <Text type="cta" color="b100">
          {getCoachFirstName(coach)} Specialities
        </Text>
        <Text
          type="body2"
          color="g100"
          style={{ marginTop: 6, marginBottom: 14 }}>
          What topics {getCoachFirstName(coach)} is open to provide you with.
        </Text>
        <div className="row speciality-container">
          {typeof specialties === 'string' &&
            specialties.split(',').map((speciality) => (
              <div className="speciality" key={speciality}>
                <Text type="footnote" color="b64">
                  {speciality}
                </Text>
              </div>
            ))}
        </div>
      </div>
      <div className="row justify-center access-container align-center">
        <div className="mobile-frame-wrapper">
          <div className="mobile-frame-container">
            <div className="call-frame-2">
              <Image
                alt="aura"
                src="/static/images/newCoach/mobileFrame.png"
                fill
              />
            </div>
            <img
              src="/static/images/newCoach/mobileFrameBackground.png"
              alt="aura"
              className="call-frame-background"
            />
          </div>
          <img
            src="/static/images/newCoach/mobileFrame2.png"
            alt="aura"
            className="call-frame"
          />
          <div className="call-frame-background-2">
            <img
              src="/static/images/newCoach/mobileBackground.png"
              alt="aura"
              className="wrapper-mobile-background"
            />
            <img
              src={coach && coach.profileBgRemovedPicture}
              alt="aura"
              className="coach-image"
            />
          </div>
          <div className="call-person">
            <img
              src="/static/images/newCoach/mobilePerson.png"
              alt="aura"
              className="call-person-icon"
            />
            <Text
              type={isMobile ? 'footnote-small' : 'body'}
              weight="semibold"
              color="w100">
              You
            </Text>
          </div>
          <div className="coach-detail">
            <img
              src={getCoachPhoto(coach)}
              alt={getCoachFirstName(coach)}
              className="coach-image-small"
            />
            <Text
              type="footnote-small"
              color="b100"
              style={{ fontSize: isMobile && 5 }}>
              {getCoachName(coach)}
            </Text>
            <div className="w-100 col">
              <div className="row">
                <img
                  src={getCoachPhoto(coach)}
                  alt={getCoachName(coach)}
                  className="coach-icon-smaller"
                />
                <div className="chat-box-white">
                  <Text color="b100" style={{ fontSize: isMobile ? 4 : 7 }}>
                    How are you doing with your goals this week?
                  </Text>
                </div>
              </div>
              <div className="right-container row">
                <div className="user-left">
                  <Text color="w100" style={{ fontSize: isMobile ? 4 : 7 }}>
                    I’m having trouble calming my anxiety before work. Can you
                    talk me through how I should approach this?
                  </Text>
                </div>
              </div>
              <div className="graph-box row align-center margin-10">
                <img
                  src="/static/images/newCoach/welnessGraph.webp"
                  alt="wellness graph"
                  className="graph-cir"
                />
                <div>
                  <div className="row margin-10">
                    <Text
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #5CE6F4, #56E774)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginRight: 4,
                        fontSize: isMobile ? 4 : 7,
                      }}>
                      Mindfulness
                    </Text>
                    <Text
                      align="left"
                      color="g100"
                      style={{ fontSize: isMobile ? 4 : 7 }}>
                      3/5 min
                    </Text>
                  </div>
                  <div className="row margin-10">
                    <Text
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #8E83FC, #8F82FC, #5FC6FC, #67BBFC)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginRight: 4,
                        fontSize: isMobile ? 4 : 7,
                      }}>
                      Sleep
                    </Text>
                    <Text
                      align="left"
                      color="g100"
                      style={{ fontSize: isMobile ? 4 : 7 }}>
                      6/8 hr
                    </Text>
                  </div>
                  <div className="row margin-10">
                    <Text
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #D16FE8, #F494B3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginRight: 4,
                        fontSize: isMobile ? 4 : 7,
                      }}>
                      Mood
                    </Text>
                    <Text
                      align="left"
                      color="g100"
                      style={{ fontSize: isMobile ? 4 : 7 }}>
                      1/3 Mood
                    </Text>
                  </div>
                </div>
              </div>
              <img
                src="/static/images/newCoach/welnessGraphVert.webp"
                alt="grpah"
                className="graph margin-10"
              />
            </div>
          </div>
        </div>
        <div className="col coach-booking">
          <Text
            type={isMobile ? 'body' : 'h4-large'}
            weight="semibold"
            color="b100"
            align={isMobile ? 'center' : 'left'}
            style={{ marginBottom: 18 }}>
            {getAvailableCoachingSpots(coach) > 0
              ? `Book 1-on-1 personal coaching with ${getCoachFirstName(
                  coach
                )} while
            space is available!`
              : `Daily access to 1-on-1 personal coaching with
            ${getCoachFirstName(coach)}`}
          </Text>
          <Text
            type="body"
            weight="regular"
            color="b64"
            align={isMobile ? 'center' : 'left'}
            style={{ whiteSpace: 'pre-line' }}>
            {getAvailableCoachingSpots(coach) > 0
              ? `Receive personalized coaching, gain new perspectives, and reach your goals with video calls and private messaging.
            \n*Coaching sessions must be accessed from a mobile device.`
              : `Receive personalized coaching, gain new perspectives, and reach your
              goals with video + unlimited messaging`}
          </Text>
          {getAvailableCoachingSpots(coach) > 0 ? (
            <div
              className="row booking-coach align-center"
              onClick={() => dispatch(handleBookCoachingCTA(coach))}>
              <Text type="body" color="b100" weight="semibold">
                Book 1-on-1 coaching
              </Text>
              <div className="spots-container">
                <div className="spots row align-center">
                  <Text type="footnote" weight="semibold" color="w100">
                    {getAvailableCoachingSpots(coach)} spots left
                  </Text>
                </div>
                <div className="shadow" />
              </div>
            </div>
          ) : (
            <JoinWaitListButton coach={coach} />
          )}
        </div>
        <div className="mobile-frame">
          <div className="mobile-frame-container">
            <img
              src="/static/images/newCoach/mobileFrame.png"
              alt="aura"
              className="call-frame-2"
            />
            <img
              src="/static/images/newCoach/mobileFrameBackground.png"
              alt="aura"
              className="call-frame-background"
            />
          </div>
          <img
            src="/static/images/newCoach/mobileFrame2.png"
            alt="aura"
            className="call-frame"
          />
          <div className="call-frame-background-2">
            <img
              src="/static/images/newCoach/mobileBackground.png"
              alt="aura"
            />
            <img
              src={coach && coach.profileBgRemovedPicture}
              alt="aura"
              className="coach-image"
            />
          </div>
          <div className="call-person">
            <img
              src="/static/images/newCoach/mobilePerson.png"
              alt="aura"
              className="call-person-icon"
            />
            <Text
              type={isMobile ? 'footnote-small' : 'body'}
              weight="semibold"
              color="w100">
              You
            </Text>
          </div>
          <div className="coach-detail">
            <img
              src={getCoachPhoto(coach)}
              alt={getCoachFirstName(coach)}
              className="coach-image-small"
            />
            <Text
              type="footnote-small"
              color="b100"
              style={{ fontSize: isMobile && 5 }}>
              {getCoachName(coach)}
            </Text>
            <div className="w-100 col">
              <div className="row">
                <img
                  src={getCoachPhoto(coach)}
                  alt={getCoachName(coach)}
                  className="coach-icon-smaller"
                />
                <div className="chat-box-white">
                  <Text color="b100" style={{ fontSize: isMobile ? 4 : 7 }}>
                    How are you doing with your goals this week?
                  </Text>
                </div>
              </div>
              <div className="right-container row">
                <div className="user-left">
                  <Text color="w100" style={{ fontSize: isMobile ? 4 : 7 }}>
                    I’m having trouble calming my anxiety before work. Can you
                    talk me through how I should approach this?
                  </Text>
                </div>
              </div>
              <div className="graph-box row align-center margin-10">
                <img
                  src="/static/images/newCoach/welnessGraph.webp"
                  alt="wellness graph"
                  className="graph-cir"
                />
                <div>
                  <div className="row margin-10">
                    <Text
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #5CE6F4, #56E774)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginRight: 4,
                        fontSize: isMobile ? 4 : 7,
                      }}>
                      Mindfulness
                    </Text>
                    <Text
                      align="left"
                      color="g100"
                      style={{ fontSize: isMobile ? 4 : 7 }}>
                      3/5 min
                    </Text>
                  </div>
                  <div className="row margin-10">
                    <Text
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #8E83FC, #8F82FC, #5FC6FC, #67BBFC)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginRight: 4,
                        fontSize: isMobile ? 4 : 7,
                      }}>
                      Sleep
                    </Text>
                    <Text
                      align="left"
                      color="g100"
                      style={{ fontSize: isMobile ? 4 : 7 }}>
                      6/8 hr
                    </Text>
                  </div>
                  <div className="row margin-10">
                    <Text
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #D16FE8, #F494B3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginRight: 4,
                        fontSize: isMobile ? 4 : 7,
                      }}>
                      Mood
                    </Text>
                    <Text
                      align="left"
                      color="g100"
                      style={{ fontSize: isMobile ? 4 : 7 }}>
                      1/3 Mood
                    </Text>
                  </div>
                </div>
              </div>
              <img
                src="/static/images/newCoach/welnessGraphVert.webp"
                alt="grpah"
                className="graph margin-10"
              />
            </div>
          </div>
        </div>
        <div className="mobile-spots-wrapper">
          <hr className="hr-mobile" style={{ width: '100%' }} />
          <Text
            type="body2"
            weight="semibold"
            color="b100"
            style={{ marginTop: 18, marginBottom: 4 }}>
            Memberships are limited
          </Text>
          <Text type="footnote" color="g100" align="center">
            Our coaches can only serve a limited amount of clients at a time.
            Act fast to claim your spot.
          </Text>
          <div className="spots-container">
            <div className="spots-large row align-center">
              <Text type="footnote" weight="semibold" color="w100">
                {getAvailableCoachingSpots(coach)} spots left
              </Text>
            </div>
            <div className="shadow" />
          </div>
        </div>
      </div>
      <hr className="hr" />
      <div className="membership-wrapper">
        <div className="col align-center membership">
          <div className="spots-container">
            <div className="spots-large row align-center">
              <Text type="body" weight="semibold" color="w100">
                {getAvailableCoachingSpots(coach)} spots left
              </Text>
            </div>
            <div className="shadow" />
          </div>
        </div>
        <Text
          weight="semibold"
          color="b100"
          style={{ fontSize: 38, marginTop: 12 }}>
          Memberships are limited
        </Text>
        <Text type="cta" color="g100" style={{ maxWidth: 431 }} align="center">
          Our coaches can only serve a limited amount of clients at a time. Act
          fast to claim your spot.
        </Text>
        {getAvailableCoachingSpots(coach) > 0 ? (
          <AuraButton
            onClick={() => dispatch(handleBookCoachingCTA(coach))}
            cleanStyle
            title="Reserve your spot"
            textWeight="bold"
            style={{ marginTop: 30 }}
          />
        ) : (
          <JoinWaitListButton coach={coach} />
        )}
        {allServices && allServices.length > 0 && (
          <>
            <hr className="hr margin-top-line" />
            <div className="col align-center coaching-bottom">
              <Text type="h2-small" color="b100" weight="regular">
                1-1 Video Coaching
              </Text>
            </div>
          </>
        )}
      </div>
      {allServices && allServices.length > 0 && (
        <div className="row justify-center w-100 info-main">
          <img
            src="/static/images/newCoach/coachingShadow.png"
            alt="aura"
            className="coaching-shadow"
          />
          <div style={{ maxWidth: '1030px' }}>
            {allServices && (
              <CustomHorizontalScrollView
                rightChevronStyles={{
                  fontSize: 24,
                  color: '#4E545F',
                  boxShadow: '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
                  background:
                    'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                }}
                leftChevronStyles={{
                  fontSize: 24,
                  color: '#4E545F',
                  boxShadow: '0px 14.8459px 51.9608px rgba(43, 42, 107, 0.15)',
                  background:
                    'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                }}
                newCoachProfile
                data={allServices}
                renderItem={(session) => (
                  <CoachingSessions
                    session={session}
                    coach={coach}
                    scrollPosition={scrollPosition}
                  />
                )}
              />
            )}
          </div>
        </div>
      )}
      {allServices && allServices.length > 0 && (
        <div className="coaching-session-heading">
          <Text
            type="cta"
            color="b100"
            style={{ marginTop: 34, marginBottom: 2 }}>
            1-1 Video Coaching
          </Text>
        </div>
      )}
      {allServices &&
        allServices.map((session) => (
          <div
            className="col w-100 algn-center relative coaching-sessions-mobile"
            key={session.name}>
            <CoachingSessions
              session={session}
              coach={coach}
              scrollPosition={scrollPosition}
            />
          </div>
        ))}
      <div className="w-100 footer">
        <Footer />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default Coaching;
