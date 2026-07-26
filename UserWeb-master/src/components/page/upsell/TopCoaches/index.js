import React, { useEffect, useRef, useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import useTheme, { THEMES } from '@/hooks/theme';
import styles from './styles';
import useBrowserHistory from '../../../../hooks/browserHistory';
import AuraRingClean from '../../../app/AuraRingClean';
import Text from '../../../app/Text';
import CoachingCoachCard from '../CoachingCoachCard';
import CustomHorizontalScrollView from '../../../app/CustomHorizontalScroll';
import useAuthUser from '../../../../hooks/authUser';
import { handleGetPricing } from '../../../../store/slices/payment';
import pricingConstants from '../../../../utils/constants/pricing';
import Analytics from '../../../../services/Analytics';
import SkipModal from '../SkipModal';

export default function TopCoaches({
  onNext,
  onBack,
  coaches,
  setCoachingSubscriptionDetails,
  isNewCoachingFlow,
  addScreen,
  removeScreen,
  experiments,
}) {
  useBrowserHistory('topCoaches', true, onBack, onNext);
  const [showAllCoaches, setShowAllCoaches] = useState(false);
  const [searchedCoaches, setSearchedCoaches] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const skipModalRef = useRef();
  const { user } = useAuthUser();
  const dispatch = useDispatch();
  useTheme(THEMES.DARK);

  useEffect(() => {
    dispatch(handleGetPricing({ id: pricingConstants.PRICING_COACHING_TRIAL }));
  }, [dispatch]);

  useEffect(() => {
    if (!searchedCoaches) {
      setSearchedCoaches(coaches);
    }
  }, [coaches, searchedCoaches]);

  function searchCoach(e) {
    const filteredCoaches = coaches.filter((coach) =>
      coach.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchedCoaches(filteredCoaches);
  }
  useEffect(() => {
    if (isNewCoachingFlow && user) {
      Analytics.track('Onboarding Top Coaches Viewed', {
        UserId: user.id,
      });
    }
  }, [isNewCoachingFlow, user]);
  function handleNotNow() {
    Analytics.track('Onboarding Coaching Free Trial Skipped', {
      isNewCoachingFlow: true,
    });
    if (isNewCoachingFlow) {
      removeScreen('bookCall');
    }
    handleNext();
  }

  function handleNext() {
    if (!user) return;
    onNext();
  }
  return (
    <div className="col align-center main-wrapper">
      {!showAllCoaches && (
        <>
          <div className="col align-center main">
            <AuraRingClean size={72} />
            <Text
              align="center"
              type="cta"
              color="b100"
              style={{ maxWidth: 300 }}>
              {user && user.givenName}, here are recommended coaches for you
              based on your answers
            </Text>

            {coaches && (
              <div className="relative coach-cards-wrapper row">
                <img
                  src="/static/images/familyPlan/coach-card-shadow.png"
                  alt="coach shadow"
                  className="coach-shadow"
                />
                <div className="coach-cards row">
                  <CustomHorizontalScrollView
                    data={coaches.slice(0, 3).concat(['all'])}
                    renderItem={(coach, index) => (
                      <CoachingCoachCard
                        coach={coach}
                        index={index}
                        setShowAllCoaches={setShowAllCoaches}
                        handleNotNow={handleNotNow}
                        onNext={onNext}
                        setCoachingSubscriptionDetails={
                          setCoachingSubscriptionDetails
                        }
                        disableButton={disableButton}
                        setDisableButton={setDisableButton}
                        isNewCoachingFlow={isNewCoachingFlow}
                        addScreen={addScreen}
                        experiments={experiments}
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {showAllCoaches && (
        <div className="col search-wrapper">
          <div className="col align-center relative">
            <div
              className="left-icon clickable"
              onClick={() => {
                setShowAllCoaches(false);
              }}>
              <BsChevronLeft />
            </div>
            <Text type="cta" color="b100" align="center">
              Coaches
            </Text>
            <div className="row search-icon-wrapper">
              <img
                src="/static/images/familyPlan/search.png"
                alt="aura search"
                className="search-icon"
              />
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                onChange={(e) => {
                  searchCoach(e);
                }}
              />
            </div>
          </div>
          <Text type="cta" color="b100" style={{ marginTop: 27 }}>
            Recommended coaches
          </Text>
          {searchedCoaches &&
            searchedCoaches
              .concat(['all'])
              .map((coach, index) => (
                <CoachingCoachCard
                  allCoaches
                  key={coach.id}
                  coach={coach}
                  index={index}
                  setShowAllCoaches={setShowAllCoaches}
                  notNowIndex={searchedCoaches.length}
                  handleNotNow={handleNotNow}
                  onNext={onNext}
                  setCoachingSubscriptionDetails={
                    setCoachingSubscriptionDetails
                  }
                  disableButton={disableButton}
                  setDisableButton={setDisableButton}
                  isNewCoachingFlow={isNewCoachingFlow}
                  addScreen={addScreen}
                  experiments={experiments}
                />
              ))}
        </div>
      )}
      {isNewCoachingFlow && (
        <SkipModal ref={skipModalRef} handleNotNow={handleNotNow} user={user} />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
