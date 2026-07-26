import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import useTranslations from '@/hooks/translations';
import { useDispatch } from 'react-redux';
import { setShowPaywallBanner } from '@/store/slices/payment';
import Text from '../../../app/Text';
import styles from './styles';

function PurchasePopUpModal(_, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslations();
  const dispatch = useDispatch();
  function show() {
    setIsVisible(true);
  }
  function hide() {
    setIsVisible(false);
  }
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  if (!isVisible) {
    return null;
  }
  return (
    <div className="purchase-popup-modal">
      <div className="popup-container">
        <div className="image-container">
          <img
            src="/static/images/PurchasePopup/heart.png"
            alt=""
            className="heart-image"
          />
        </div>
        <div className="text-container">
          <Text color="w100" type="subtitle" align="left">
            {t('payment_subscribe_millions_have_improved')}
          </Text>
          <Text color="w100" type="subtitle" align="left" weight="semibold">
            {t('payment_subscribe_take_the_step')}
          </Text>
        </div>
        <div
          className="cross-icon clickable"
          onClick={() => {
            hide();
            dispatch(setShowPaywallBanner(false));
          }}>
          <AiOutlineClose />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(PurchasePopUpModal);
