import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { GrClose } from 'react-icons/gr';
import useTranslations from '@/hooks/translations';
import styles from './styles';
import AuraButtonSecondary from '../../../app/AuraButtonSecondary';
import Text from '../../../app/Text';

const SYMPTOM_KEYS = [
  'onboarding_common_symptoms_modal_item_exhaustion',
  'onboarding_common_symptoms_modal_item_lack_of_creativity',
  'onboarding_common_symptoms_modal_item_loss_of_purpose',
  'onboarding_common_symptoms_modal_item_quickness_to_anger',
  'onboarding_common_symptoms_modal_item_difficulty_concentrating',
  'onboarding_common_symptoms_modal_item_negative_attitudes',
  'onboarding_common_symptoms_modal_item_emotional_numbness',
  'onboarding_common_symptoms_modal_item_frustration',
];
function CommonSymptomsModal(_, ref) {
  const { t } = useTranslations();
  const [isModalVisible, setIsModalVisible] = useState(false);
  function showModal() {
    setIsModalVisible(true);
  }
  function hideModal() {
    setIsModalVisible(false);
  }
  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));
  if (!isModalVisible) {
    return null;
  }

  return (
    <div id="modal">
      <div className="card component-shadow modal-card w-100">
        <img
          src="/static/images/guaranteeModal.png"
          alt="aura"
          className="background-image"></img>
        <div className="list-container">
          <Text type="body" weight="regular" color="b800" align="left">
            {t('onboarding_common_symptoms_modal_heading')}
            <ul>
              {SYMPTOM_KEYS.map((key) => (
                <li key={key}>
                  <Text
                    style={{ marginTop: 10 }}
                    type="body"
                    weight="regular"
                    color="b800"
                    align="left">
                    {t(key)}
                  </Text>
                </li>
              ))}
            </ul>
          </Text>
        </div>
        <div className="close-icon clickable" onClick={hideModal}>
          <GrClose />
        </div>
        <AuraButtonSecondary
          textWeight="bold"
          cleanStyle
          title={t('button_continue')}
          onClick={hideModal}
          style={{
            marginTop: 28,
            width: 219,
            height: 48,
          }}
        />
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
export default forwardRef(CommonSymptomsModal);
