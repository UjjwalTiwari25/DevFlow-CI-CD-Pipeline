import classNames from 'classnames';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  getCoachPhoto,
  getAvailableCoachingSpots,
  getCoachName,
} from '@/models/coach';
import useCountryDetails from '@/hooks/countryDetails';
import AvailabilityCard from '@/components/coachingSession/Details/AvailabilityCard';
import CleanLoginModal from '@/components/login/CleanLoginModal';
import AuraButton from '@/components/app/AuraButton';
import useAuthUser from '@/hooks/authUser';
import useToastMessage from '@/hooks/toastMessage';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Analytics from '@/services/Analytics';
import {
  setAllowAppointment,
  createAppointmentAction,
  setLoading,
  setAppointmentType,
  setSelectedPlan,
  setWaitListStatus,
  setShowWaitListModal,
} from '@/store/slices/coaching';
import useTranslations from '@/hooks/translations';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import { setUserInWaitList } from '@/models/service';
import Loader from '@/components/app/Loader';
import schedulingConstants from '@/utils/constants/scheduling';
import WaitlistModal from '@/components/coachingSession/WaitlistModal';
import { pollUserExists } from '@/models/user';
import useFetchUserActiveCoaching from '@/hooks/fetchUserActiveCoaching';
import styles from './styles.module.scss';
import PlanSection from './PlanSection';
import IntroVideo from './IntroVideo';
import HowItWork from './HowItWork';
import About from './About';
import JoinWaitListCard from './JoinWaitListCard';
import SelectCoachingPlan from './SelectCoachingPlan';
import AlreadySubscribedCard from './AlreadySubscribedCard';

function VideoSessionLandingPage({
  coach,
  allServices,
  allPackages,
  schedulingDetails,
  onSubmitSignup,
  onNext,
  excludeDiscovery,
}) {
  const { t } = useTranslations();
  const data = {
    duration: 30,
    sessionTypeId: schedulingConstants.SESSION_TYPES.FREE_DISCOVERY,
  };
  const {
    sortedTimeSlots,
    selectedTime,
    allowAppointment,
    isLoading,
    selectedPlan,
    showWaitListModal,
  } = useShallowEqualSelector(({ coaching }) => coaching);
  const { showError } = useToastMessage();
  const {
    id: coachId,
    name,
    nickname,
    coachingApproach,
    bio,
    countryCode,
    specialties,
    professionalTitle,
  } = coach || {};
  const [, isMobile] = useResponsiveWindow();
  const { countryDetails } = useCountryDetails(countryCode);
  const { coachingIntroVideo } = schedulingDetails || {};
  const [userSelectedTime, setUserSelectedTime] = useState(
    selectedTime ? format(new Date(selectedTime.start), 'h:mm a') : null
  );
  const [showServiceCount, setShowServiceCount] = useState(3);
  const { user, authLoading } = useAuthUser();
  const [isWaitListLogin, setIsWaitListLogin] = useState();
  const dispatch = useDispatch();
  const loginModalRef = useRef(null);
  const {
    isLoadingUserActiveCoaching,
    isFetchedUserActiveCoaching,
    hasActiveCoaching,
  } = useFetchUserActiveCoaching({ excludeDiscovery, coachId });
  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }

  async function onDateSelect() {
    setUserSelectedTime(null);
  }

  async function onTimeSelect(time) {
    setUserSelectedTime(time);
    await dispatch(setAppointmentType('free-discovery'));
  }

  const onSelectPlan = (plan) => {
    if (plan) {
      Analytics.track('Coaching Plan Selected', {
        CoachId: coach.id,
        CoachName: getCoachName(coach),
        SelectedDuration: plan.duration,
        SelectedNumberOfSession: plan.numberOfSessions,
        Price: plan.price,
      });
      dispatch(setSelectedPlan(plan));
    }
    if (!user) {
      showLoginModal();
    }
    if (
      user &&
      plan &&
      !hasActiveCoaching &&
      !isLoadingUserActiveCoaching &&
      isFetchedUserActiveCoaching
    ) {
      onNext();
    }
  };

  async function setUserAppointment() {
    const appointmentInformation = {
      ...data,
      coachId: coach?.id,
      start: selectedTime.start,
      end: selectedTime.end,
      requiresCoachingSubscription: false,
      preventAutoConfirm: true,
      includesCoaching: true,
    };

    const res = await dispatch(
      createAppointmentAction({
        time: userSelectedTime,
        appointmentInformation,
      })
    ).unwrap();
    if (res && !res.error) {
      dispatch(setAllowAppointment(false));
      onNext();
    } else {
      showError(t('error_failed_book_appointment'));
    }
  }

  async function onContinue() {
    if (!user) {
      showLoginModal();
    }
    if (
      user &&
      !hasActiveCoaching &&
      !isLoadingUserActiveCoaching &&
      isFetchedUserActiveCoaching
    ) {
      setUserAppointment();
    }
  }

  const joinWaitList = useCallback(async () => {
    await setUserInWaitList(coach.id, user.id);
    Analytics.track('Join Coaching Wait List', {
      UserId: user.id,
      CoachId: coach.id,
      CoachName: getCoachName(coach),
    });
    dispatch(setShowWaitListModal(true));
  }, [user, dispatch, coach?.id]);

  useEffect(() => {
    if (
      user &&
      selectedTime &&
      allowAppointment &&
      sortedTimeSlots &&
      !hasActiveCoaching &&
      !isLoadingUserActiveCoaching &&
      isFetchedUserActiveCoaching
    ) {
      dispatch(setLoading(true));
      pollUserExists(user.id).then(async (result) => {
        if (result && !result.error) {
          setUserAppointment();
        }
      });
    }
  }, [dispatch, user, isFetchedUserActiveCoaching]);

  useEffect(() => {
    if (
      user &&
      selectedPlan &&
      excludeDiscovery &&
      !hasActiveCoaching &&
      !isLoadingUserActiveCoaching &&
      isFetchedUserActiveCoaching
    ) {
      dispatch(setLoading(true));
      pollUserExists(user.id).then(async (result) => {
        if (result && !result.error) {
          dispatch(setLoading(false));
          onNext();
        }
      });
    }
  }, [dispatch, user, isFetchedUserActiveCoaching]);

  useEffect(() => {
    if (user && getAvailableCoachingSpots(coach) !== 0 && isWaitListLogin) {
      joinWaitList();
    }
  }, [coach, joinWaitList, user, isWaitListLogin]);

  const onJoinWaitlist = async () => {
    dispatch(setWaitListStatus(true));
    if (!user) {
      setIsWaitListLogin(true);
      showLoginModal();
    }
    if (user) {
      await joinWaitList();
    }
  };

  if (isLoading || isLoadingUserActiveCoaching || authLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.coachInfoSection}>
        <div className={styles.coachInfoHeader}>
          <div>
            <Image
              src={getCoachPhoto(coach, 'photo200Url')}
              alt=""
              height={isMobile ? 100 : 130}
              width={isMobile ? 100 : 130}
              style={{ borderRadius: 130, objectFit: 'cover' }}
            />
          </div>
          <div className={styles.coachNameWrpper}>
            <div className={styles.coachName}>{name}</div>
            <div className={styles.coachSpecialties}>{professionalTitle}</div>
            {countryDetails && (
              <div className="flex row align-center">
                <Image
                  src={countryDetails && countryDetails.imageUrl}
                  alt={countryDetails && countryDetails.displayName}
                  width={20}
                  height={20}
                  style={{
                    marginRight: 5,
                    height: 'auto',
                  }}
                />
                <div className={styles.countryName}>
                  {countryDetails.displayName}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.coachInfoList}>
          {specialties && (
            <div className={styles.coachInfoWrapper}>
              <div className={styles.coachInfoListTitle}>
                {t('video_coaching_title_specialties')}
              </div>
              <div className={styles.specialityList}>
                {specialties &&
                  specialties.split(',').map((speciality) => (
                    <div className={styles.specialityItem} key={speciality}>
                      {speciality}
                    </div>
                  ))}
              </div>
            </div>
          )}
          {allServices && allServices?.length > 0 && (
            <div className={styles.coachInfoWrapper}>
              <div className={styles.coachInfoListTitle}>
                {t('video_coaching_title_services')}
              </div>
              <div className={styles.serviceList}>
                {allServices.slice(0, showServiceCount).map((serviceItem) => (
                  <div key={serviceItem.id} className={styles.serviceItemTitle}>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="7"
                        viewBox="0 0 6 7"
                        fill="none">
                        <circle cx="3" cy="3.35547" r="3" fill="#2F3237" />
                      </svg>
                    </div>
                    <div>{serviceItem.title}</div>
                  </div>
                ))}
                {allServices && allServices.length > 3 && (
                  <div
                    className={classNames('clickable', styles.viewMoreButton)}
                    onClick={() => {
                      if (showServiceCount === 3) {
                        setShowServiceCount(allServices.length);
                      } else {
                        setShowServiceCount(3);
                      }
                    }}>
                    {showServiceCount === 3
                      ? t('button_show_all')
                      : t('button_show_less')}
                  </div>
                )}
              </div>
            </div>
          )}

          <PlanSection allPackages={allPackages} />
        </div>
        {coachingIntroVideo && (
          <div className={styles.introVideoSection}>
            <IntroVideo coachingIntroVideo={coachingIntroVideo} />
          </div>
        )}
        <div className={styles.bioSection}>
          <div className={styles.bioWrapper}>
            <div className={styles.bioTitle}>
              {t('video_coaching_title_biography')}
            </div>
            <div className={styles.bioText}>{bio}</div>
          </div>
          {coachingApproach && (
            <div className={styles.bioWrapper}>
              <div className={styles.bioTitle}>
                {t('video_coaching_title_approach_to_coaching')}
              </div>
              <div className={styles.bioText}>{coachingApproach}</div>
            </div>
          )}
        </div>
        {allServices && (
          <div className={styles.serviceSection}>
            <div className={styles.serviceSectionTitle}>
              {t('video_coaching_title_coach_services', {
                nickname: nickname || getCoachName(coach),
              })}
            </div>
            <div className={styles.serviceListWrapper}>
              {allServices.map((service) => (
                <div key={service.id} className={styles.serviceCard}>
                  <div className={styles.serviceTitle}>{service.title}</div>
                  <div className={styles.serviceText}>
                    {service.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <HowItWork />
        <About coach={coach} />

        <div
          className={classNames(
            'row align-center',
            styles.buttonContainer,
            styles.mobileOnly
          )}>
          {getAvailableCoachingSpots(coach) === 0 && (
            <AuraButton
              title={t('button_join_waitlist')}
              withShadow
              cleanStyle
              textWeight="bold"
              style={{
                width: '100%',
                height: '55px',
              }}
              onClick={() => {
                onJoinWaitlist();
              }}
            />
          )}
          {sortedTimeSlots &&
            Object.keys(sortedTimeSlots).length > 0 &&
            getAvailableCoachingSpots(coach) !== 0 && (
              <AuraButton
                title={t('button_next')}
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
            )}
        </div>
      </div>

      <div className={styles.availability_card}>
        <RightSectionComponent
          videoCoachingFlow
          userSelectedTime={userSelectedTime}
          setUserSelectedTime={setUserSelectedTime}
          onDateSelect={onDateSelect}
          onTimeSelect={onTimeSelect}
          onContinue={onContinue}
          coach={coach}
          isSlotAvailable={getAvailableCoachingSpots(coach) > 0}
          onJoinWaitlist={onJoinWaitlist}
          excludeDiscovery={excludeDiscovery}
          allPackages={allPackages}
          onSelectPlan={onSelectPlan}
          sortedTimeSlots={sortedTimeSlots}
          hasActiveCoaching={hasActiveCoaching}
          isLoadingUserActiveCoaching={isLoadingUserActiveCoaching}
        />
      </div>

      <CleanLoginModal
        ref={loginModalRef}
        isCoachingSession
        coach={coach}
        onSubmit={onSubmitSignup}
        loading={authLoading}
      />

      {showWaitListModal && (
        <WaitlistModal coach={coach} redirectToGetAppPage />
      )}
    </div>
  );
}

function RightSectionComponent(props) {
  const {
    allPackages,
    isSlotAvailable,
    excludeDiscovery,
    sortedTimeSlots,
    hasActiveCoaching,
    isLoadingUserActiveCoaching,
  } = props || {};
  if (isLoadingUserActiveCoaching) return <Loader />;
  if (hasActiveCoaching) {
    return <AlreadySubscribedCard excludeDiscovery={excludeDiscovery} />;
  }
  if (
    isSlotAvailable &&
    excludeDiscovery &&
    allPackages &&
    allPackages?.length > 0
  )
    return <SelectCoachingPlan {...props} />;
  if (
    isSlotAvailable &&
    !excludeDiscovery &&
    sortedTimeSlots &&
    Object.keys(sortedTimeSlots).length > 0
  )
    return <AvailabilityCard {...props} />;
  return <JoinWaitListCard {...props} />;
}

export default VideoSessionLandingPage;
