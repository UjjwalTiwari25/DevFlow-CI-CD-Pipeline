import React from 'react';
import { Trans } from 'react-i18next';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

export default function PaymentSocialProof() {
  const { isDark } = useThemeListener();

  return (
    <div className="card-container">
      <div className="social-container">
        <img
          src="/static/images/socialProofs/socialProof.png"
          alt="socail-proof"
          className="social-proofs"
        />
      </div>
      <div>
        <Text
          type="h4"
          color={isDark ? 'b100' : 'g100'}
          align="center"
          weight="bold"
          style={{
            marginTop: '38px',
            marginBottom: '10px',
            lineHeight: '24px',
            maxWidth: '295px',
          }}>
          <Trans
            ns="subscribe"
            i18nKey="payment_subscribe_social_proof_already_on_aura"
            components={[
              <span
                key="socialProof"
                style={{ color: 'rgba(254, 233, 6, 1)' }}></span>,
            ]}
          />
        </Text>
        <div className="social-container">
          <img
            src="/static/images/socialProofs/stars.png"
            alt="stars"
            className="stars"
          />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
