import { useState, useEffect } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Image from 'next/image';
import { Badge, RadioButton } from '@aurahealth/web-design-system';
import {
  getDiscount,
  getDiscountedPricing,
  getPricing,
  getPricingForDuration,
  getYearlyPricing,
} from '@/models/payment';
import I18NFormatter from '@/services/I18NFormatter';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import pricingConstants from '@/utils/constants/pricing';
import styles from './styles.module.scss';

const PLAN_LIST = [
  {
    id: 'AqQAYk9XyTyw2d0',
    duration: 1,
    mostPopular: false,
  },
  {
    id: 'McwjYTcblA8OZbg',
    duration: 3,
    mostPopular: true,
  },
  {
    id: 'NHkkcVnYWkwFtfh',
    duration: 12,
    mostPopular: false,
  },
];

function ChoosePlan({
  className,
  selectedPlan,
  setSelectedPlan,
  isLast,
  experiments,
}) {
  const [planList, setPlanList] = useState([]);
  const { formatLocalPricing } = useConvertPriceInLocalCurrency({
    experiments,
  });

  const getCurrentPriceText = (price, prefix) => {
    const priceArray = price.toString().split('.');
    if (prefix) {
      return priceArray[0];
    }
    return priceArray.length > 1 ? priceArray[1] : 0;
  };

  useEffect(() => {
    const fetchPlanData = async (planListItems) => {
      const planData = await Promise.all(
        planListItems?.map(async (item) => {
          const pricing = await getPricing(item.id);
          return {
            ...item,
            pricing,
          };
        })
      );
      setPlanList(planData);
      setSelectedPlan(planData[1]?.id);
      return planData;
    };
    let selectedList = PLAN_LIST;
    if (experiments.threeSKUsV2 === 'a') {
      selectedList = pricingConstants.SKU_WITH_TRIAL_PRICING;
    } else {
      selectedList = PLAN_LIST;
    }
    fetchPlanData(selectedList);
  }, [experiments]);

  const { t } = useTranslations();
  return (
    <div
      className={classNames(styles.container, className, {
        [styles.containerPadding]: isLast,
        [styles.noContainerMargin]: isLast && experiments?.noTrial3SKUs === 'c',
      })}>
      <div
        className={classNames(styles.wrapper, {
          [styles.wrapperCenter]: isLast && experiments?.noTrial3SKUs !== 'c',
        })}>
        <div className={styles.choosePlanText}>
          {t('choose_your_plan_text')}
        </div>

        <div className={styles.itemList}>
          {planList.map((item) => (
            <div
              className={classNames(styles.itemWrapper, {
                [styles.mostPoularItem]: selectedPlan === item.id,
              })}
              key={item.id}>
              {item.mostPopular && (
                <Badge
                  title={t('text_most_popular')}
                  color="blue"
                  size="extra-small"
                  containerClassName={styles.mostPopularBadge}
                />
              )}
              <div
                className={classNames(styles.itemContent, 'clickable', {
                  [styles.itemContentCenter]: !item.mostPopular,
                })}
                onClick={() => {
                  setSelectedPlan(item.id);
                }}>
                <div className={styles.leftSection}>
                  <RadioButton
                    isActive={selectedPlan === item.id}
                    handleClick={() => {
                      setSelectedPlan(item.id);
                    }}
                  />
                  <div>
                    <div className={styles.monthText}>
                      {t('month_text', {
                        count: item.duration,
                      })}
                    </div>
                    {item.pricing &&
                      (getDiscount(item.pricing) > 0 || item.discount) && (
                        <Badge
                          color="green"
                          size="extra-small"
                          title={t('save_percentage_text', {
                            count: item.discount
                              ? item.discount
                              : item.pricing?.discountDescription,
                          })}
                          containerClassName={styles.saveBadge}
                        />
                      )}
                    {item.pricing && item.pricing.trial > 0 && (
                      <Badge
                        color="white"
                        size="extra-small"
                        title={t('text_free_trial', {
                          count: item.pricing.trial,
                        })}
                      />
                    )}
                    <div className={styles.priceWrapper}>
                      {getDiscount(item.pricing) > 0 && (
                        <div className={classNames(styles.discountedPrice)}>
                          {formatLocalPricing(getYearlyPricing(item.pricing))}
                        </div>
                      )}
                      <div
                        className={classNames(styles.priceText, {
                          [styles.priceTextWhite]:
                            getDiscount(item.pricing) > 0,
                        })}>
                        {formatLocalPricing(getDiscountedPricing(item.pricing))}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={classNames(styles.rightSection, {
                    [styles.itemContentCenter]: !item.mostPopular,
                  })}>
                  <div className={styles.dailyPricePrefix}>
                    {I18NFormatter.formatCurrency(
                      getCurrentPriceText(
                        getPricingForDuration(item.pricing, 'daily'),
                        true
                      ),
                      { maximumFractionDigits: 0 }
                    )}
                  </div>
                  <div>
                    <div className={styles.dailyPriceDecimal}>
                      {`.${getCurrentPriceText(
                        getPricingForDuration(item.pricing, 'daily')
                      )}`}
                    </div>
                    <div className={styles.perDayText}>{t('per_day_text')}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.moneyGuaranteeContainer}>
          <div className={styles.moneyGuaranteeWrapper}>
            <div className={styles.moneyGuaranteeContent}>
              <Image
                src="/static/images/bullet-guarantee.svg"
                height={24}
                width={24}
                alt=""
              />
              <div className={styles.moneyGuaranteeText}>
                {t('choose_plan_money_back_guarantee')}
              </div>
            </div>
          </div>
          <div className={styles.contactForRefundText}>
            {t('choose_plan_contact_for_refund')}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChoosePlan;
