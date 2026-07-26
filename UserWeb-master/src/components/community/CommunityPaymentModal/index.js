import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import useCommunityPayment from '@/hooks/communityPayment';
import useAuthUser from '../../../hooks/authUser';
import CommunityPurchase from './CommunityPurchase';
import styles from './styles.module.scss';

function CommunityPaymentModal({ community, coach, onClose, onNext }, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuthUser();
  const stripe = useStripe();
  const {
    handleSubmit,
    showUserError,
    isProcessing,
    onCardChange,
    cards,
    isCardSavedToFile,
    activeCard,
  } = useCommunityPayment({
    community,
    stripe,
    onSuccessfulPurchase: () => {
      onNext();
      toggle();
    },
  });

  useEffect(() => {
    if (user) {
      setIsVisible(false);
    }
  }, [user]);
  function toggle() {
    setIsVisible((prev) => !prev);
  }
  useImperativeHandle(ref, () => ({
    toggle,
  }));
  if (!isVisible) {
    return null;
  }
  return (
    <div className={styles.paymentModal}>
      <CommunityPurchase
        onClose={onClose}
        community={community}
        coach={coach}
        isCardSavedToFile={isCardSavedToFile}
        activeCard={activeCard}
        handleSubmit={handleSubmit}
        isProcessing={isProcessing}
        showUserError={showUserError}
        onCardChange={onCardChange}
        cards={cards}
      />
    </div>
  );
}

export default forwardRef(CommunityPaymentModal);
