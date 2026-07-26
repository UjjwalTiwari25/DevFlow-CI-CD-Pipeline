import { useRef, useEffect } from 'react';
import useBrowserHistory from '@/hooks/browserHistory';
import { useDispatch } from 'react-redux';
import useAuthUser from '@/hooks/authUser';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import CleanLoginModal from '@/components/login/CleanLoginModal';
import { setSelectedPlan, setLoading } from '@/store/slices/coaching';
import Analytics from '@/services/Analytics';
import { getCoachName } from '@/models/coach';
import { pollUserExists } from '@/models/user';
import Loader from '@/components/app/Loader';
import SelectCoachingPlan from '../SelectCoachingPlan';
import styles from './styles.module.scss';

function SelectCoachingPlanScreen({
  allPackages,
  coach,
  onNext,
  onBack,
  onSubmitSignup,
}) {
  useBrowserHistory('coachingSelectPlan', true, onBack, onNext);
  const { user, authLoading } = useAuthUser();
  const dispatch = useDispatch();
  const { selectedPlan, isLoading } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );
  const loginModalRef = useRef(null);

  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }

  const onSelectPlan = (plan) => {
    if (plan) {
      dispatch(setSelectedPlan(plan));
      Analytics.track('Coaching Plan Selected', {
        CoachId: coach.id,
        CoachName: getCoachName(coach),
        SelectedDuration: plan.duration,
        SelectedNumberOfSession: plan.numberOfSessions,
        Price: plan.price,
      });
    }
    if (!user) {
      showLoginModal();
    }
    if (user && plan) {
      onNext();
    }
  };

  useEffect(() => {
    if (user && selectedPlan) {
      dispatch(setLoading(true));
      pollUserExists(user.id).then((result) => {
        if (result && !result.error) {
          onNext();
          dispatch(setLoading(false));
        }
      });
    }
  }, [dispatch, selectedPlan, user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.selectPlanContainer}>
        <SelectCoachingPlan
          allPackages={allPackages}
          coach={coach}
          onSelectPlan={onSelectPlan}
        />
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        isCoachingSession
        coach={coach}
        onSubmit={onSubmitSignup}
        loading={authLoading}
      />
    </div>
  );
}
export default SelectCoachingPlanScreen;
