import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import OnboardingBigContinueButton from '@/components/app/OnboardingBigContinueButton';
import Text from '@/components/app/Text';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles from './styles';

export default function SocialProofScreenWeb({ onNext, onBack, experiments }) {
  useBrowserHistory('socialProofScreen', true, onBack, onNext);
  const { t } = useTranslations();
  return (
    <Fragment>
      <div data-testid="socialProofScreen" className="item-container">
        <div>
          <div>
            <Text
              type="h2"
              weight="semibold"
              color="b100"
              align="center"
              style={{ marginBottom: '4px' }}>
              {t('onboarding_million_people')}
            </Text>
            <Text
              type="h3"
              weight="regular"
              color="b100"
              align="center"
              style={{ marginBottom: '24px' }}>
              {t('onboarding_use_aura')}
            </Text>
          </div>
          <div
            className="testimonial-container"
            style={{ marginBottom: '32px' }}>
            <div className="image-container">
              <img
                className="quote-images"
                src="/static/images/specialty.quote.fill.png"
                alt="specialty quote"
              />
            </div>
            <Text
              type="h4"
              weight="400"
              color="b100"
              align="center"
              style={{ padding: '0px 20px', lineHeight: '23px' }}>
              {t('onboarding_named_no_one_app_by_apple')}
            </Text>
            <div className="image-container" style={{ marginTop: '16px' }}>
              <img
                width="140px"
                height="24px"
                src="/static/images/the-new-york-times-logo.png"
                alt="the-new-york-times-logo"
              />
            </div>
          </div>
          <div className="review-container">
            <Text
              align="center"
              color="b100"
              weight="semibold"
              style={{ lineHeight: '23px', fontSize: '18px' }}>
              {t('onboarding_mention_in')}
            </Text>
            <img
              src="/static/images/forebs-image.png"
              alt="mention-by"
              style={{
                height: 'auto',
                width: '317px',
                marginTop: '8px',
              }}
            />
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
