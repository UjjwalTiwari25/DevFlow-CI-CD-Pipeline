import React from 'react';
import { useDispatch } from 'react-redux';
import {
  getAvailableCoachingSpots,
  getCoachFirstName,
  getCoachName,
  getCoachPhoto,
} from '../../../../models/coach';
import AuraButtonSecondary from '../../../app/AuraButtonSecondary';
import Text from '../../../app/Text';
import AuraLive from '../../AuraLive';
import Loader from '../../../app/Loader';

import styles from './styles';
import CustomHorizontalScrollView from '../../../app/CustomHorizontalScroll';
import Footer from '..';
import DailyAccessRow from '../../DailyAccessRow';
import Content from '../../Content';
import CoachingSessions from '../../CoachingSessions';
import { handleBookCoachingCTA } from '../../../../store/slices/coaching';
import JoinWaitListButton from '../../JoinWaitListButton';

function Home({
  coach,
  tracks,
  newTracks,
  allTracksByType,
  allServices,
  liveEvents,
  setSelectedTab,
  isMobile,
  isCoachingEnabled,
  loadingTracks,
}) {
  const { approvedTrackCount, bookable } = coach || {};
  const dispatch = useDispatch();

  return (
    <>
      <div className="main">
        <img
          src="/static/images/newCoach/circleBackground.png"
          alt="aura"
          className="circle"
        />
        <div className={`container col ${!isMobile && 'align-center'}`}>
          {bookable && isCoachingEnabled && (
            <>
              <div className="heading">
                <Text
                  type="h1-large"
                  weight="regular"
                  color="b100"
                  align="center">
                  Coaching
                </Text>
              </div>
              <div className="heading-mobile">
                <Text
                  type="cta"
                  weight="regular"
                  color="b100"
                  style={{ padding: '0px 32px', marginBottom: 12 }}>
                  Coaching
                </Text>
                <div className="coach-values">
                  <div className="row align-center">
                    <div className="coach-mobile-image-container">
                      <img
                        src={getCoachPhoto(coach)}
                        alt={getCoachName(coach)}
                        className="coach-mobile-image"
                      />
                      <img
                        src="/static/images/newCoach/coachValueGraph.png"
                        alt={`${getCoachName(coach)} values`}
                        className="coach-value-graph"
                      />
                    </div>
                    <div>
                      <Text
                        type="h4"
                        weight="semibold"
                        color="b100"
                        style={{ lineHeight: '18px', marginBottom: 5 }}>
                        Get 1-1 Coaching with {getCoachFirstName(coach)}
                      </Text>
                      <Text
                        weight="regular"
                        color="b64"
                        style={{ fontSize: 13 }}>
                        Receive personalized coaching, gain new perspectives,
                        and reach your wellness goals
                      </Text>
                    </div>
                  </div>
                  {getAvailableCoachingSpots(coach) > 0 ? (
                    <div
                      className="row booking-coach clickable"
                      onClick={() => dispatch(handleBookCoachingCTA(coach))}>
                      <Text type="body" color="b100" weight="semibold">
                        Book 1-on-1 coaching
                      </Text>
                      <div className="spots-container">
                        <div className="spots row align-center">
                          <Text
                            type="footnote"
                            weight="semibold"
                            color="w100"
                            style={{ marginTop: 1 }}>
                            {getAvailableCoachingSpots(coach)} spots left
                          </Text>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <JoinWaitListButton coach={coach} />
                  )}
                </div>
              </div>
              <div className="w-100 row access-row">
                <DailyAccessRow coach={coach} />
              </div>
            </>
          )}
          {!isMobile && <hr className="hr" style={{ marginTop: '-4px' }} />}
          {allServices && allServices.length > 0 && (
            <>
              <div className="relative">
                <img
                  src="/static/images/coachingSession/sessionMobileBackgrounds.png"
                  alt="aura background"
                  className="live-session-background"
                />
              </div>
              <div
                className={`live-session-container only-left-padding col ${
                  !isMobile && 'align-center'
                }`}>
                <Text
                  type={isMobile ? 'body' : 'h2'}
                  weight="regular"
                  color="b100">
                  1-1 Video Coaching
                </Text>
                {allServices && (
                  <div className="row info-main">
                    <CustomHorizontalScrollView
                      data={allServices}
                      newCoachProfile
                      rightChevronStyles={{
                        fontSize: 20,
                        color: '#4E545F',
                        boxShadow: '0px 10px 35px rgba(43, 42, 107, 0.45)',
                        background:
                          'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                      }}
                      leftChevronStyles={{
                        fontSize: 20,
                        color: '#4E545F',
                        boxShadow: '0px 10px 35px rgba(43, 42, 107, 0.45)',
                        background:
                          'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                      }}
                      renderItem={(session) => (
                        <CoachingSessions
                          session={session}
                          horizontalOnly
                          coach={coach}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {liveEvents && liveEvents.length > 0 && (
            <AuraLive
              showViewAll
              coach={coach}
              liveEvents={liveEvents.slice(0, 3)}
              setSelectedTab={setSelectedTab}
              isHomePage
            />
          )}
          {!!approvedTrackCount && (
            <div className={`live-session-container-2 col align-center`}>
              <Text
                type={isMobile ? 'h4' : 'h1-large'}
                weight="regular"
                color="b100">
                Coach tracks
              </Text>
              {loadingTracks ? (
                <Loader />
              ) : (
                <Content
                  coach={coach}
                  allTracksByType={allTracksByType}
                  tracks={tracks}
                  newTracks={newTracks}
                  isHomePage
                />
              )}
              <div className="row justify-center w-100">
                <AuraButtonSecondary
                  title="Explore all the content"
                  style={{
                    marginBottom: '38px',
                    boxShadow: '0px 8px 40px rgba(43, 42, 107, 0.1)',
                  }}
                  textWeight="semibold"
                  textStyle={{ fontSize: 17 }}
                  onClick={() => {
                    setSelectedTab('Content');
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <style jsx>{styles}</style>
    </>
  );
}

export default Home;
