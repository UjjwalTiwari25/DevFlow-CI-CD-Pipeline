import React from 'react';
import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { getTypeTitle } from '@/utils/community';
import { convertToDollar } from '@/utils';
import styles from './styles.module.scss';

function PurchaseCommunityEventOrCourse({
  isUserAlreadyPurchased,
  isUserSubscriber,
  isPartOfCommunity,
  isExclusiveToCommunity,
  isFree,
  eventOrCoursePrice,
  eventOrCourseCommunityPrice,
  eventOrCourseCommunityMemberDiscount,
  type,
  renderSubmitButton,
}) {
  const { t } = useTranslations();

  return (
    <div className={styles.purchaseCourseWrapper}>
      <div className={styles.priceHeader}>
        <div className={styles.purchaseCourseFor}>
          {t('purchase_card_purchase_for', {
            type: t(getTypeTitle(type), { count: 1 }),
          })}
        </div>
      </div>
      <div>
        <div className={styles.coursePriceDetails}>
          <div className={styles.coursePrice}>
            {isFree ? (
              t('price_text_free')
            ) : (
              <>
                {isExclusiveToCommunity ? (
                  <span>
                    {I18NFormatter.formatCurrency(
                      convertToDollar(eventOrCourseCommunityPrice),
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </span>
                ) : (
                  <>
                    <span>
                      {I18NFormatter.formatCurrency(
                        convertToDollar(eventOrCourseCommunityPrice),
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </span>
                    &nbsp;
                    <span className={styles.originalValueStrike}>
                      {I18NFormatter.formatCurrency(
                        convertToDollar(eventOrCoursePrice),
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </span>
                    {eventOrCourseCommunityMemberDiscount > 0 && (
                      <div className={styles.discountText}>
                        <Trans
                          i18nKey={'purchase_card_community_member_discount'}
                          components={[
                            <span
                              key="discount-text"
                              className={styles.discount}></span>,
                          ]}
                          values={{
                            discountPrice: I18NFormatter.formatCurrency(
                              eventOrCourseCommunityMemberDiscount,
                              { maximumFractionDigits: 0 }
                            ),
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {isExclusiveToCommunity && (
            <div className={styles.communityExclusiveText}>
              {t('community_exclusive_text', {
                type: t(getTypeTitle(type), { count: 1 }),
              })}
            </div>
          )}
        </div>
      </div>
      {!(
        isUserAlreadyPurchased &&
        (isUserSubscriber || !isPartOfCommunity)
      ) && (
        <div className={styles.purchaseCourseButton}>
          {renderSubmitButton &&
            typeof renderSubmitButton === 'function' &&
            renderSubmitButton()}
        </div>
      )}
    </div>
  );
}

export default PurchaseCommunityEventOrCourse;
