import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import { getTypeTitle } from '@/utils/community';
import styles from '../styles.module.scss';

function CommunityMemberEventOrCoursePurchase({
  isExclusiveToCommunity,
  isFree,
  eventOrCoursePrice,
  eventOrCourseCommunityPrice,
  eventOrCourseCommunityMemberDiscount,
  isUserSubscriber,
  type,
}) {
  const { t } = useTranslations();
  return (
    <div>
      <div className={styles.purchaseEventWrapper}>
        <div>
          <div className={styles.purchaseEventFor}>
            {t('purchase_card_purchase_for', {
              type: t(getTypeTitle(type), { count: 1 }),
            })}
          </div>
        </div>
        <div>
          <div className={styles.eventPriceDetails}>
            <div className={styles.eventPrice}>
              {isFree ? (
                <>
                  <div>{t('price_text_free')}</div>
                  {isUserSubscriber && eventOrCoursePrice > 0 && (
                    <div className={styles.nonMemberEventPrice}>
                      {t('purchase_card_non_members_price', {
                        price: I18NFormatter.formatCurrency(
                          convertToDollar(eventOrCoursePrice),
                          { maximumFractionDigits: 0 }
                        ),
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isExclusiveToCommunity ? (
                    <span>
                      {I18NFormatter.formatCurrency(
                        convertToDollar(eventOrCourseCommunityPrice),
                        { maximumFractionDigits: 0 }
                      )}
                    </span>
                  ) : (
                    <>
                      <span>
                        {I18NFormatter.formatCurrency(
                          convertToDollar(eventOrCourseCommunityPrice),
                          { maximumFractionDigits: 0 }
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
                            ns="common"
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
              <div className={styles.communityExclusiveEventText}>
                {t('community_exclusive_text', {
                  type: t(getTypeTitle(type), {
                    count: 1,
                  }),
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CommunityMemberEventOrCoursePurchase;
