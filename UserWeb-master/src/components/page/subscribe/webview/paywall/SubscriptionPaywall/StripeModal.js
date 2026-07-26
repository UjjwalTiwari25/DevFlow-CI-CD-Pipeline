import React from 'react';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import useTranslations from '@/hooks/translations';
import CardInput from '@/components/payment/clean/CardInput';
import AuraButton from '@/components/app/AuraButton';
import styles from './style.module.scss';

export default function StripeModal({ handleSubmit, loading, onClose }) {
  const { t } = useTranslations();
  const { pricing } = useShallowEqualSelector(({ payment }) => payment);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalSheet}>
        <button type="button" className={styles.modalClose} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M1 1L15 15M15 1L1 15"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <p className={styles.modalTitle}>Enter card details</p>
        <form onSubmit={handleSubmit} className={styles.modalCardForm}>
          <CardInput autoFocus />
          <AuraButton
            blinking
            title={
              pricing?.trial !== 0 && !pricing?.trialFee
                ? t(pricing?.checkout)
                : t(pricing?.checkoutIap)
            }
            loading={loading}
            style={{
              minWidth: 230,
              height: 56,
              borderRadius: 100,
              color: '#fff',
              background:
                'linear-gradient(46.17deg, #4CCAFF 0%, #1DF5ED 102.13%)',
              boxShadow: '0px 8px 32px 2px #38DAF74D',
            }}
            textWeight="bold"
          />
        </form>
      </div>
    </div>
  );
}
