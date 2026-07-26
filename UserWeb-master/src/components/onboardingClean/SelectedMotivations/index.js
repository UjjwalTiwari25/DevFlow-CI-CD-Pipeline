import React, { Fragment, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import useTranslations from '@/hooks/translations';
import Text from '../../app/Text';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import TOPICS from '../../../data/topics.json';
import Loader from '../../app/Loader';
import { initialCapital } from '../../../utils';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import styles from './styles';

const extraTopic = {
  unique: 'peacefulMoments',
  isActive: false,
  img: {
    uri: '/static/images/dion.jpg',
  },
  motivation: 'to find more peaceful moments in my day',
};

export default function SelectedMotivations({
  onNext,
  onBack,
  profile: { givenName, motivationPreference = {}, experiments },
}) {
  useBrowserHistory('selectedMotivations', true, onBack, onNext);
  const { t } = useTranslations();
  const [motivations, setMotivations] = useState([]);
  const [showRemaining, setShowRemaining] = useState(false);
  useEffect(() => {
    if (Object.keys(motivationPreference).length !== 0) {
      const selectedMovitations = Object.values(TOPICS).filter((topic) => {
        return Object.keys(motivationPreference).find(
          (selectedTopic) => topic.unique === selectedTopic
        );
      });
      if (motivationPreference[extraTopic.unique]) {
        selectedMovitations.push(extraTopic);
      }
      setMotivations(selectedMovitations);
    }
  }, [motivationPreference]);

  const onContinue = () => {
    onNext();
  };

  if (
    motivations.length === 0 &&
    Object.keys(motivationPreference).length !== 0
  ) {
    return <Loader />;
  }
  const remainingMotivations = motivations.length - 4;

  return (
    <Fragment>
      <Header
        title={
          givenName
            ? t('onboarding_selected_motivations_excellent', {
                name: givenName,
              })
            : t('onboarding_selected_motivations_perfect')
        }
        subtitle={
          motivations.length > 0
            ? t('onboarding_selected_motivations_what_you_created')
            : t('onboarding_selected_motivations_in_days')
        }
        experiments={experiments}
      />
      <div className="item-container">
        <div>
          {motivations.length > 0 ? (
            motivations.slice(0, 4).map((item) => (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 12,
                }}
                key={item.unique}>
                <img src={item.img.uri} alt={item.unique} className="avatar" />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  {initialCapital(
                    t(item.motivation).substr(item.motivation.indexOf(' ') + 1)
                  )}
                </Text>
              </div>
            ))
          ) : (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <img
                  src="/static/images/icons/vision1.png"
                  alt="vision1"
                  className="avatar-large"
                />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  {t('onboarding_selected_motivations_wake_up_feeling')}
                </Text>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <img
                  src="/static/images/icons/vision2.png"
                  alt="vision1"
                  className="avatar-large"
                />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  {t('onboarding_selected_motivations_understand_and_manage')}
                </Text>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <img
                  src="/static/images/icons/vision3.png"
                  alt="vision1"
                  className="avatar-large"
                />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  {t('onboarding_selected_motivations_increase_self_awareness')}
                </Text>
              </div>
            </div>
          )}
          {showRemaining &&
            motivations.slice(4, motivations.length).map((item) => (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 12,
                }}
                key={item.unique}>
                <img src={item.img.uri} alt={item.unique} className="avatar" />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  {initialCapital(
                    t(item.motivation).substr(item.motivation.indexOf(' ') + 1)
                  )}
                </Text>
              </div>
            ))}
        </div>
        {remainingMotivations > 0 && (
          <div
            className="plus-benfits-container"
            onClick={() => {
              setShowRemaining(!showRemaining);
            }}>
            <div className="plus-benefits">
              {!showRemaining && (
                <FiPlus style={{ width: '16px', filter: 'invert(1)' }} />
              )}

              <Text
                type="body2"
                color="b100"
                weight="semibold"
                style={{ lineHeight: '18px', marginLeft: '3px' }}>
                {showRemaining
                  ? t('onboarding_selected_motivations_hide_benefits', {
                      count: remainingMotivations,
                    })
                  : t('onboarding_selected_motivations_more_benefit', {
                      count: remainingMotivations,
                    })}
              </Text>
            </div>
          </div>
        )}
        {motivations.length > 0 && (
          <Text
            type="body"
            align="left"
            color="b100"
            style={{ margin: '20px 0', paddingBottom: 45 }}>
            {t('onboarding_selected_motivations_97_members')}
          </Text>
        )}
        <div className="text-bottom">
          <Text type="body" align="left" color="b100">
            {t('onboarding_selected_motivations_we_are_excited')}
          </Text>
        </div>
      </div>
      <OnboardingBigContinueButton
        title={t('onboarding_selected_motivations_button_continue')}
        experiments={experiments}
        onClick={onContinue}
      />
      <style jsx>{styles}</style>
    </Fragment>
  );
}
