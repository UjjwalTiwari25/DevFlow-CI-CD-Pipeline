import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../hooks/browserHistory';
import LoginCard from '../../login/clean';
import Header from '../Header';
import styles from './styles';

export default function Signup({
  onNext,
  onBack,
  disableLogin,
  isCoachingOnboarding,
  experiments,
  profile,
  isModalSignup,
  hide,
  user: userData,
}) {
  useBrowserHistory('signup', true, onBack, onNext);
  const { t } = useTranslations();
  const user = userData || profile;

  const getTitle = () => {
    if (typeof user.personalizePlan !== 'undefined' && !user.personalizePlan) {
      return 'onboarding_signup_form_save_progess_exp';
    }
    return 'onboarding_signup_form_save_progess';
  };
  return (
    <Fragment>
      <div className="item-container">
        <Header
          isCoaching={!!isCoachingOnboarding}
          subtitleColor="g50"
          title={t(getTitle(), { givenName: user.givenName })}
          center={true}
          experiments={experiments}
          isModalSignup={isModalSignup}
        />
        <LoginCard
          onSubmit={({ givenName }) => {
            onNext({ givenName });
          }}
          buttonText={t('onboarding_signup_form_button_text_see_my_plan')}
          disableLogin={disableLogin}
          showGoogleLogin={false}
          hideCard={true}
          style={{
            marginTop: 24,
            minWidth: isModalSignup && 0,
          }}
          disableSocial={true}
          profile={profile}
          isModalSignup={isModalSignup && !isCoachingOnboarding}
          hide={hide}
          user={user}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
