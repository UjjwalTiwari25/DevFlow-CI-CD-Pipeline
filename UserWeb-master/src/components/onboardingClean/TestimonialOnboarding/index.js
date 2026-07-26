import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import OnboardingBigContinueButton from '@/components/app/OnboardingBigContinueButton';
import Text from '@/components/app/Text';
import { getLocaleImage } from '@/models/locale';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles from './styles';

const testimonial = {
  topicTestimonial: {
    name: 'onboarding_testimonial_topic_name',
    description: 'onboarding_testimonial_topic_description',
  },
  wellnessTestimonial: {
    name: 'onboarding_testimonial_wellness_name',
    description: 'onboarding_testimonial_wellness_description',
  },
  sleepTestimonial: {
    name: 'onboarding_testimonial_sleep_name',
    description: 'onboarding_testimonial_sleep_description',
  },
  coachTestimonial: {
    name: 'onboarding_testimonial_coach_name',
    description: 'onboarding_testimonial_coach_description',
    descriptionChakraExp: 'onboarding_testimonial_coach_description_chakra_exp',
  },
  motivationTestimonial: {
    name: 'onboarding_testimonial_motivation_name',
    description: 'onboarding_testimonial_motivation_description',
  },
};

export default function TestimonialOnboarding({
  onNext,
  onBack,
  experiments,
  type,
}) {
  useBrowserHistory('testimonialOnboarding', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();
  const [testimonialData, setTestimonialData] = useState(null);

  useEffect(() => {
    if (type === 'coach') {
      setTestimonialData(testimonial.coachTestimonial);
      return;
    }

    if (type === 'sleep') {
      setTestimonialData(testimonial.sleepTestimonial);
      return;
    }

    if (type === 'wellness') {
      setTestimonialData(testimonial.wellnessTestimonial);
      return;
    }

    if (type === 'motivation') {
      setTestimonialData(testimonial.motivationTestimonial);
      return;
    }
    setTestimonialData(testimonial.topicTestimonial);
  }, [type]);

  const getDescription = useCallback(() => {
    if (testimonialData?.descriptionChakraExp) {
      return testimonialData?.descriptionChakraExp;
    }
    return testimonialData?.description;
  }, [testimonialData]);

  return (
    <Fragment>
      <Header experiments={experiments} />
      <div className="item-container">
        <div>
          <div
            className={'testimonial-container'}
            style={{
              top: '160px',
            }}>
            <img
              className="five-star"
              src="/static/images/5stars.png"
              alt="Rated 5 stars"
            />
            <Text
              type="h4"
              weight="regular"
              color="b100"
              align="left"
              style={{ marginBottom: 12 }}>
              <Trans
                ns="signup"
                i18nKey={getDescription()}
                components={[
                  <span
                    key="highlighted-text"
                    className="highlighted-text"></span>,
                ]}
              />
            </Text>
            <div className="profile">
              <div className="profile-initial">
                <Text
                  type="h4"
                  weight="semibold"
                  align="center"
                  style={{ color: '#9092A3' }}>
                  {t(testimonialData?.name)[0]}
                </Text>
              </div>
              <Text type="h4" weight="semibold" align="center" color="b100">
                {t(testimonialData?.name)}
              </Text>
            </div>
          </div>
          <div className="review-container">
            <img
              src={getLocaleImage(
                '/static/images/trusted-by-users.png',
                currentLocale
              )}
              alt="trusted-by-users"
              style={{
                maxHeight: '70px',
                width: 'auto',
                minWidth: '144px',
              }}
            />
            <Text
              type="body2"
              align="center"
              color="b70"
              style={{ lineHeight: '17px' }}>
              {t('onboarding_testimonial_over_45k_review')}
            </Text>
          </div>
        </div>
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={() => onNext()}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
