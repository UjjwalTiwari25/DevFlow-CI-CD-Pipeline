import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { getTypeTitle } from '@/utils/community';
import communityContants from '@/utils/constants/community';
import { convertToDollar } from '@/utils';
import styles from '../styles.module.scss';

function NonMemberEventOrCoursePurchase({
  isPastEvent,
  isExclusiveToCommunity,
  isUserAlreadyPurchased,
  eventOrCourseTitle,
  onJoinSingleEventOrCourse,
  coach,
  community,
  eventOrCoursePrice,
  type,
} = {}) {
  const totalEstimatedValue = community?.offerings
    ? community?.offerings.reduce(
        (acc, offer) => acc + Number(offer.estimatedValue),
        0
      )
    : 0;

  const { t } = useTranslations();
  return (
    <div className={styles.nonMemberCardContainer}>
      {!isPastEvent && (
        <>
          {!isExclusiveToCommunity && !isUserAlreadyPurchased && (
            <>
              <div className={styles.singleContainerWrapper}>
                <div>
                  <div className={styles.purchaseCardEventTitle}>
                    {eventOrCourseTitle}
                  </div>
                  <div className={styles.purchaseCardEventText}>
                    {t('purchase_card_purchase_for', {
                      type: t(getTypeTitle(type), { count: 1 }),
                    })}
                  </div>
                  <div className={styles.purchaseCardEventPrice}>
                    {I18NFormatter.formatCurrency(
                      convertToDollar(eventOrCoursePrice),
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </div>
                </div>

                <div
                  className={styles.purchaseCardEventBtn}
                  onClick={onJoinSingleEventOrCourse}>
                  <div className={styles.purchaseCardEventBtnText}>
                    {t(
                      type === communityContants.COMMUNITY_FEATURE_TYPES.COURSE
                        ? 'course_purchase_single_course'
                        : 'event_purchase_card_purchase_single_event'
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.horizontalRowOr}>
                <div className={styles.horizontalRow}></div>
                {t('text_or')}
                <div className={styles.horizontalRow}></div>
              </div>
            </>
          )}
        </>
      )}

      <div className={styles.joinCommunityContainer}>
        <div>
          {isExclusiveToCommunity && (
            <div className={styles.communityExclusiveText}>
              {t('community_exclusive')}
            </div>
          )}
          <div className={styles.purchaseCardJoinCommunityText}>
            {t('purchase_card_coach_community', {
              coachName: coach.name,
            })}
          </div>
        </div>
        <div className={styles.communityOfferList}>
          {community.offerings &&
            community.offerings.map((offer, index) => (
              <div key={index} className={styles.communityOfferingsSection}>
                <div className={styles.offerTitle}>{offer.title}</div>
                <div className={styles.offerValue}>
                  {I18NFormatter.formatCurrency(
                    convertToDollar(offer.estimatedValue),
                    { maximumFractionDigits: 0 }
                  )}
                </div>
              </div>
            ))}
          <div className={styles.horizontalRowFull}></div>

          <div className={styles.totalValue}>
            <div className={styles.totalValueText}>
              {t('purchase_card_total_value')}
            </div>
            <div className={styles.totalValueStrike}>
              {I18NFormatter.formatCurrency(
                convertToDollar(totalEstimatedValue),
                { maximumFractionDigits: 0 }
              )}
            </div>
          </div>
          <div className={styles.yourCost}>
            <div className={styles.yourCostText}>
              {t('purchase_card_your_cost')}
            </div>
            <div className={styles.yourCostPerMonth}>
              {t('community_price_per_month', {
                communityPrice: I18NFormatter.formatCurrency(
                  convertToDollar(community.price),
                  { maximumFractionDigits: 0 }
                ),
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.joinCommunityWrapper}>
        <div className={styles.communityPrice}>
          {t('text_just')}&nbsp;
          {t('community_price_per_month', {
            communityPrice: I18NFormatter.formatCurrency(
              convertToDollar(community.price),
              { maximumFractionDigits: 0 }
            ),
          })}
        </div>
        <div className={styles.communityWorth}>
          {t('purchase_card_worth', {
            communityWorth: I18NFormatter.formatCurrency(
              convertToDollar(totalEstimatedValue),
              { maximumFractionDigits: 0 }
            ),
          })}
        </div>
      </div>
    </div>
  );
}
export default NonMemberEventOrCoursePurchase;
