import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import Testimonial from '../../../onboardingClean/Testimonial';
import styles from './styles';

export default function CustomerReview({
  className,
  isCoachPlan,
  hideText,
  experiments,
}) {
  const { t } = useTranslations();
  return (
    <div
      className={classNames(`${className}`, {
        'card-short': isCoachPlan,
        card: !isCoachPlan,
        'padding-normal': !isCoachPlan,
      })}>
      <div
        className={classNames({
          width: isCoachPlan,
          animation: !isCoachPlan,
        })}>
        {!hideText && (
          <Text type="h3-large" weight="regular" color="b100" align="left">
            {t('onboarding_your_plan_customer_reviews', { ns: 'yourplan' })}
          </Text>
        )}
        <Testimonial
          isCoachPlan={isCoachPlan}
          isYourPlan={true}
          experiments={experiments}
          name={t('onboarding_your_plan_customer_reviews_name', {
            ns: 'yourplan',
          })}
          image={'/static/images/robertProfile.png'}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
