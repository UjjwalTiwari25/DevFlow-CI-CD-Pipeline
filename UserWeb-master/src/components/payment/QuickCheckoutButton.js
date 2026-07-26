import React from 'react';
import { DiApple } from 'react-icons/di';
import useTranslations from '@/hooks/translations';
import Loader from '../app/Loader';
import Text from '../app/Text';

export default function QuickCheckoutButton({
  applePay,
  handlePaymentRequestSubmit,
  isLoading,
  style,
}) {
  const { t } = useTranslations();

  function renderContent() {
    if (isLoading) {
      return <Loader size={24} color="#03a9f4" style={{ height: '100%' }} />;
    }
    if (applePay) {
      return (
        <div className="row justify-center align-center">
          <div style={{ fontSize: 22 }}>
            <DiApple />
          </div>
          <Text
            color="b100"
            type="h4"
            weight="regular"
            align="center"
            style={{ marginBottom: 2 }}>
            {t('button_pay')}
          </Text>
        </div>
      );
    }
    return (
      <div className="row justify-center align-center">
        <img
          src="/static/images/icons/google.png"
          alt=""
          style={{
            width: 18,
            height: 18,
            marginRight: 4,
          }}
        />
        <Text color="b100" type="h4" weight="regular" align="center">
          {t('button_pay')}
        </Text>
      </div>
    );
  }

  return (
    <button
      onClick={handlePaymentRequestSubmit}
      className="payment-request-btn clickable"
      disabled={isLoading}
      type="button"
      style={style}>
      {renderContent()}
      <style jsx>{`
        .payment-request-btn {
          border-radius: 8px;
          background-color: #fff;
          border: 0;
          width: 100%;
          padding: 8px;
          height: 38px;
          cursor: pointer;
          box-shadow: 0px 0px 2px #000;
          align-items: center;
          display: flex;
          justify-content: center;
          outline: none;
        }
      `}</style>
    </button>
  );
}
