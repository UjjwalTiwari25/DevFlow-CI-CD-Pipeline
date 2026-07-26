import React from 'react';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import { getTypeTitle } from '@/utils/community';
import styles from './styles.module.scss';

function PurchaseStandaloneEventOrCourse({
  isUserAlreadyPurchased,
  isFree,
  eventOrCoursePrice,
  type,
  renderSubmitButton,
}) {
  const { t } = useTranslations();

  return (
    <div className={styles.purchaseCourseWrapper}>
      <div className={styles.purchaseCourseHeader}>
        <div className={styles.purchaseCourseFor}>
          {t('purchase_card_purchase_for', {
            type: t(getTypeTitle(type), { count: 1 }),
          })}
        </div>
      </div>
      <div className={styles.coursePriceHeader}>
        <div className={styles.coursePrice}>
          {isFree
            ? t('price_text_free')
            : I18NFormatter.formatCurrency(
                convertToDollar(eventOrCoursePrice),
                {
                  maximumFractionDigits: 0,
                }
              )}
        </div>
      </div>
      {!isUserAlreadyPurchased && (
        <div className={styles.purchaseCourseButton}>
          {renderSubmitButton &&
            typeof renderSubmitButton === 'function' &&
            renderSubmitButton()}
        </div>
      )}
    </div>
  );
}

export default PurchaseStandaloneEventOrCourse;
