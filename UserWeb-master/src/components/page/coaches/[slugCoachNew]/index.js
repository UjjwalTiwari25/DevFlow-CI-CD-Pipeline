import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Link from 'next/link';
import { getCountDisplayValue } from '../../../../utils';
import Text from '../../../app/Text';
import styles from './styles';
import useTrackPageView from '../../../../hooks/trackPageView';
import useCountryDetails from '../../../../hooks/countryDetails';
import AuraRingClean from '../../../app/AuraRingClean';
import CoachClippedText from '../../../app/CoachClippedText';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import {
  getAvailableCoachingSpots,
  getCoachName,
  getCoachPhoto,
  getCoachTracksByCategory,
  listCoachTracksByType,
} from '../../../../models/coach';
import { getISOLocale } from '../../../../models/locale';
import { getCoachLiveEvents } from '../../../../models/live';
import useAuthUser from '../../../../hooks/authUser';
import UserDropDown from '../../../app/UserDropDown';
import AuraLive from '../../../coachDetails/AuraLive';
import About from '../../../coachDetails/About';
import Content from '../../../coachDetails/Content';
import Home from '../../../coachDetails/Footer/Home';
import Coaching from '../../../coachDetails/Coaching';
import CleanLoginModal from '../../../login/CleanLoginModal';
import { listCoachServices } from '../../../../models/service';
import { handleBookCoachingCTA } from '../../../../store/slices/coaching';
import JoinWaitListButton from '../../../coachDetails/JoinWaitListButton';
import WaitlistModal from '../../../coachingSession/WaitlistModal';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import {
  setLoginModalRef,
  setShowLoginForm,
  setScrollPosition,
  setTabName,
} from '../../../../store/slices/newCoachProfiles';
import usePageQuery from '../../../../hooks/pageQuery';
import routeConstants from '../../../../utils/constants/routes';

const tabs = ['Home', 'About'];

export default function SlugCoachNew({ coach, onSubmitSignup }) {
  const router = useRouter();
  const { tab: defaultTab } = usePageQuery();
  const { tabName } = useShallowEqualSelector(({ profiles }) => profiles);
  const [selectedTab, setSelectedTab] = useState(
    defaultTab || tabName || 'Home'
  );
  const [tracks, setTracks] = useState(null);
  const [newTracks, setNewTracks] = useState(null);
  const [allTracksByType, setAllTracksByType] = useState({});
  const [loadingTracks, setLoadingTracks] = useState(true);

  const {
    id,
    name,
    bio,
    countryCode,
    followersCount = 0,
    listenedCount = 0,
    playedCount = 0,
    professionalTitle,
    coachingEnabledAt,
  } = coach;
  const isCoachingEnabled = !!coachingEnabledAt;
  useTrackPageView({ CoachID: id, 'Coach Name': name }, [coach]);

  const [, isMobile] = useResponsiveWindow();
  const [allServices, setAllServices] = useState(null);
  const [isStickyNav, setIsStickyNav] = useState(false);
  const [liveEvents, setLiveEvents] = useState(null);
  const { user, authLoading } = useAuthUser();
  const navbarRef = useRef(null);
  const heroSectionRef = useRef(null);
  const loginModalRef = useRef(null);
  const dispatch = useDispatch();
  const { isLoading, liveEventDetails } = useShallowEqualSelector(
    ({ live }) => live
  );
  const { showLoginForm } = useShallowEqualSelector(({ profiles }) => profiles);
  const { showWaitListModal } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );

  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setCurrentScrollPosition(position);
  };

  useEffect(() => {
    if (['Live', 'Coaching'].includes(selectedTab))
      window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedTab]);

  useEffect(() => {
    if (defaultTab) {
      setSelectedTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    function insertTab(tab) {
      const position = tabs.length - 1;
      if (!tabs.includes(tab)) {
        tabs.splice(position, 0, tab);
      }
    }
    const { bookable, approvedTrackCount } = coach;
    if (approvedTrackCount > 0) insertTab('Content');
    if (bookable && isCoachingEnabled) insertTab('Coaching');
    if (liveEvents && liveEvents.length) insertTab('Live');
  }, [coach, liveEvents, isCoachingEnabled]);

  useEffect(() => {
    async function fetchLiveEvent() {
      const res = await getCoachLiveEvents(coach.id);
      if (res && !res.error) {
        setLiveEvents(res);
      }
    }
    if (coach) {
      fetchLiveEvent();
    }
  }, [coach]);
  useEffect(() => {
    async function getAllServices() {
      const res = await listCoachServices(coach.id);
      if (res && !res.error) {
        setAllServices(res);
      }
    }
    if (coach && !allServices) {
      getAllServices();
    }
  }, [coach, allServices]);

  // Fetch tracks on client side
  useEffect(() => {
    async function fetchTracks() {
      if (!coach || !coach.id) {
        setLoadingTracks(false);
        return;
      }
      try {
        setLoadingTracks(true);
        const locale = getISOLocale(router.locale);
        const [popularTracksData, newTracksData] = await Promise.all([
          getCoachTracksByCategory({
            coachId: coach.id,
            useOnlyPopular: true,
            locale: 'all',
            preferredLocale: locale,
          }),
          getCoachTracksByCategory({
            coachId: coach.id,
            sinceDays: 30,
            locale: 'all',
            preferredLocale: locale,
          }),
        ]);
        setTracks(popularTracksData);
        setNewTracks(newTracksData);

        // Fetch tracks by type if coach has types
        const { types } = coach;
        if (types) {
          const typesKeys = Object.keys(types);
          const allTracks = await listCoachTracksByType({
            types: typesKeys,
            coachId: coach.id,
            locale: 'all',
            preferredLocale: locale,
          });
          const tracksByType = {};
          allTracks.forEach((tracksForType, index) => {
            const type = typesKeys[index];
            tracksByType[type] = tracksForType;
          });
          setAllTracksByType(tracksByType);
        }
      } catch (error) {
        // Error handled silently - component will show empty state
      } finally {
        setLoadingTracks(false);
      }
    }
    fetchTracks();
  }, [coach, router.locale]);

  const scrollHandler = useCallback(() => {
    if (navbarRef && navbarRef.current) {
      if (
        navbarRef.current.getBoundingClientRect().y < 10 &&
        heroSectionRef.current.getBoundingClientRect().y < 50 &&
        !isStickyNav
      ) {
        setIsStickyNav(true);
      }
    }
  }, [isStickyNav]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler, true);
    return () => {
      window.removeEventListener('scroll', scrollHandler, true);
    };
  }, [scrollHandler]);

  const heroScrollHandler = useCallback(() => {
    if (heroSectionRef && heroSectionRef.current) {
      if (heroSectionRef.current.getBoundingClientRect().y > 0) {
        setIsStickyNav(false);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', heroScrollHandler, true);
    return () => {
      window.removeEventListener('scroll', heroScrollHandler, true);
    };
  }, [heroScrollHandler]);

  useEffect(() => {
    if (loginModalRef && loginModalRef.current) {
      dispatch(setLoginModalRef(loginModalRef.current));
    }
  }, [dispatch, showLoginForm, isLoading, liveEventDetails]);

  const { countryDetails } = useCountryDetails(countryCode);
  const maxPlays = Math.max(listenedCount, playedCount);
  return (
    <div className="main">
      <img
        src="/static/images/newCoach/opticalBackground.png"
        alt="aura background"
        className="optical-background"
      />
      <div className="outer-wrap col align-center">
        <div className="w-100 nav">
          <Link href={`/${routeConstants.PAGE_AURA}`} legacyBehavior>
            <a className="row align-center clickable aura-logo">
              <AuraRingClean size={34} />
              {!isMobile && (
                <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                  Aura
                </Text>
              )}
            </a>
          </Link>
          {!isStickyNav && !user && (
            <div
              className="clickable signin-button"
              onClick={() => {
                dispatch(setShowLoginForm(true));
                if (loginModalRef.current) {
                  loginModalRef.current.show();
                }
              }}>
              <Text type="body" color="b100">
                Sign in
              </Text>
            </div>
          )}
          {user && !isStickyNav && (
            <div
              className="signin-button"
              style={{
                position: 'relative',
              }}>
              <UserDropDown
                user={user}
                authLoading={authLoading}
                style={{ maxWidth: '100%' }}
                isCoachingSession
              />
            </div>
          )}
        </div>
        <div className="coach-info row">
          {!isMobile && !!getCoachPhoto(coach) && (
            <span className="coach-image">
              <Image
                src={coach && getCoachPhoto(coach)}
                alt="aura coach"
                fill
              />
            </span>
          )}
          {isMobile && (
            <>
              <Image
                src={coach && getCoachPhoto(coach)}
                alt="aura coach"
                width={200}
                height={200}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <hr className="hr" />
            </>
          )}
          <div className="col info-container">
            <Text
              type={isMobile ? 'h3-large' : 'h1-large'}
              color="b100"
              weight={isMobile ? 'semibold' : 'regular'}
              style={{
                marginTop: isMobile && 19,
                marginBottom: isMobile && 10,
              }}>
              {name}
            </Text>
            <Text type="body" color="b100" weight="regular">
              {professionalTitle}
            </Text>
            {isMobile && (
              <div className="stats-mobile">
                <div className="row align-center country-row">
                  <Image
                    src={countryDetails && countryDetails.imageUrl}
                    alt={countryDetails && countryDetails.displayName}
                    width={21}
                    height={16}
                    style={{
                      marginRight: 8,
                    }}
                  />
                  <Text
                    type="body2"
                    color="b100"
                    weight="regular"
                    style={{
                      maxWidth: 188,
                    }}>
                    {countryDetails && countryDetails.displayName}
                  </Text>
                </div>
              </div>
            )}
            {!isMobile && coach.bookable && isCoachingEnabled && (
              <>
                {getAvailableCoachingSpots(coach) > 0 ? (
                  <div
                    className="row booking-coach align-center clickable"
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
              </>
            )}
            <div className="statistics row">
              <div className="stats">
                <Text type="body2" color="b64">
                  Followers
                </Text>
                <Text type="cta" color="b100" style={{ marginTop: 4 }}>
                  {`${getCountDisplayValue(followersCount)}`}
                </Text>
              </div>
              <div className="stats">
                <Text type="body2" color="b64">
                  Plays
                </Text>
                <Text type="cta" color="b100" style={{ marginTop: 4 }}>
                  {`${getCountDisplayValue(maxPlays)}`}
                </Text>
              </div>
              {!isMobile && (
                <div className="stats">
                  <Text type="body2" color="b64">
                    Country
                  </Text>
                  <div className="row align-center country-row">
                    <Image
                      src={countryDetails && countryDetails.imageUrl}
                      alt={countryDetails && countryDetails.displayName}
                      width={21}
                      height={16}
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <Text
                      type="body"
                      color="b100"
                      weight="regular"
                      style={{
                        maxWidth: 188,
                      }}>
                      {countryDetails && countryDetails.displayName}
                    </Text>
                  </div>
                </div>
              )}
            </div>
            {isMobile && coach.bookable && isCoachingEnabled && (
              <>
                {getAvailableCoachingSpots(coach) > 0 ? (
                  <div
                    className="row booking-coach align-center clickable"
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
              </>
            )}
            <CoachClippedText
              isMobile={isMobile}
              type="body2"
              color="g100"
              style={{
                lineHeight: '21px',
                marginTop: isMobile ? 20 : 23,
                maxWidth: 453,
              }}>
              {bio}
            </CoachClippedText>
          </div>
        </div>
      </div>
      <div
        className={isStickyNav ? 'tabs-container-fixed' : 'tabs-container'}
        ref={navbarRef}>
        {!isMobile && <hr className="hr" />}
        <div
          className={classNames('row tabs align-center', {
            'zero-padding': isStickyNav,
            'justify-center': !isMobile || (isMobile && !user && !isStickyNav),
          })}>
          {isStickyNav && !isMobile && (
            <div className="nav-coach row align-center">
              <Image
                src={getCoachPhoto(coach)}
                alt={getCoachName(coach)}
                width={45}
                height={45}
                style={{
                  borderRadius: '50%',
                  boxShadow: `5px 13px 21px -5px rgba(48, 56, 72, 0.25), 
      inset 0px -1px 1px #ffffff`,
                  marginRight: '14px',
                }}
              />
              {!isMobile && (
                <Text type="body" color="b100" weight="bold">
                  {getCoachName(coach)}
                </Text>
              )}
            </div>
          )}
          {isStickyNav && isMobile && (
            <Image
              src={getCoachPhoto(coach)}
              alt={getCoachName(coach)}
              width={45}
              height={45}
              style={{
                borderRadius: '50%',
                boxShadow: `5px 13px 21px -5px rgba(48, 56, 72, 0.25), 
  inset 0px -1px 1px #ffffff`,
                marginRight: '14px',
              }}
            />
          )}
          {tabs.map((tab) => (
            <div
              className="tab clickable"
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                dispatch(setTabName(tab));
                dispatch(setScrollPosition(0));
              }}>
              <Text type={isMobile ? 'body2' : 'body'} color="g100">
                {tab}
              </Text>
              {tab === selectedTab && <div className="underline-black" />}
            </div>
          ))}
          {isStickyNav && !user && (
            <>
              {authLoading ? (
                <Text type={isMobile ? 'body2' : 'body'} color="b100">
                  Loading...
                </Text>
              ) : (
                <div className="tab clickable">
                  <Text
                    type={isMobile ? 'body2' : 'body'}
                    color="b100"
                    onClick={() => {
                      if (loginModalRef.current) {
                        loginModalRef.current.show();
                        dispatch(setShowLoginForm(true));
                      }
                    }}
                    style={{ cursor: 'pointer', minWidth: 50 }}>
                    Sign in
                  </Text>
                </div>
              )}
            </>
          )}
          {user && isStickyNav && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: !isMobile && 'relative',
              }}>
              <UserDropDown
                user={user}
                authLoading={authLoading}
                style={{ maxWidth: '100%' }}
                isNewCoachProfile={true}
              />
            </div>
          )}
        </div>
        <hr className="hr" />
      </div>
      <div ref={heroSectionRef}>
        <NewCoachTabs
          coach={coach}
          tracks={tracks}
          newTracks={newTracks}
          tab={selectedTab}
          setSelectedTab={setSelectedTab}
          allTracksByType={allTracksByType}
          liveEvents={liveEvents}
          allServices={allServices}
          isMobile={isMobile}
          scrollPosition={currentScrollPosition}
          loadingTracks={loadingTracks}
        />
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        coach={coach}
        onSubmit={onSubmitSignup}
        showLoginForm={showLoginForm}
        loading={authLoading}
      />
      {showWaitListModal && (
        <WaitlistModal coach={coach} setSelectedTab={setSelectedTab} />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
function NewCoachTabs({ tab, loadingTracks, ...props }) {
  switch (tab) {
    case 'Home':
      return <Home {...props} loadingTracks={loadingTracks} />;
    case 'Live':
      return <AuraLive {...props} />;
    case 'About':
      return <About {...props} />;
    case 'Content':
      return <Content {...props} loadingTracks={loadingTracks} />;
    case 'Coaching':
      return <Coaching {...props} />;
    default:
      return null;
  }
}
