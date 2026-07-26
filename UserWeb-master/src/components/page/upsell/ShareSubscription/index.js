import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useTheme, { THEMES } from '@/hooks/theme';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../../hooks/browserHistory';
import AuraButtonSecondary from '../../../app/AuraButtonSecondary';
import Text from '../../../app/Text';
import styles from './styles';
import useAuthUser from '../../../../hooks/authUser';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import FamilyPlanInviteInput from '../FamilyPlanInviteInput';
import {
  getFamilyPlanInviteList,
  getUserSubscription,
} from '../../../../models/user';

export default function ShareSubscription({ onBack, onNext, experiments }) {
  useBrowserHistory('shareSubscription', true, onBack, onNext);
  const [familyPlanSeats, setFamilyPlanSeats] = useState(null);
  const { user } = useAuthUser();
  const { pricing } = useShallowEqualSelector(({ payment }) => payment);
  const { maxFamilyMembers } = pricing || {};
  const { t } = useTranslations();

  useEffect(() => {
    if (maxFamilyMembers && !familyPlanSeats) {
      setFamilyPlanSeats(Array.from(Array(maxFamilyMembers - 1).keys()));
    }
  }, [maxFamilyMembers]);

  useEffect(() => {
    async function getFamilySlots() {
      const res = await getUserSubscription(user.id);
      if (res && res.maxFamilyPlanMembers) {
        setFamilyPlanSeats(
          Array.from(Array(res.maxFamilyPlanMembers - 1).keys())
        );
      }
    }
    if (user) {
      getFamilySlots();
      // After purchase, there is a delay in updating the Firebase subscription node
      setTimeout(() => {
        getFamilySlots();
      }, 4000);
    }
  }, [user]);

  const [inviteList, setInviteList] = useState(null);
  useEffect(() => {
    async function getInvitesList() {
      const userInviteList = await getFamilyPlanInviteList(user.id);
      if (userInviteList) {
        setInviteList(userInviteList);
      }
    }
    if (!inviteList) {
      getInvitesList();
    }
  }, [inviteList, user.id]);

  const [isChecked, setIsChecked] = useState(false);

  useTheme(THEMES.LIGHT);

  return (
    <div className="col align-center">
      <div className="page">
        <img
          src="/static/images/icons/auraRingClean.webp"
          alt="Aura Logo"
          style={{
            width: 68,
            height: 68,
            marginTop: 30,
          }}
        />
        <Text type="h3-large" color="b100" align="center">
          {t('upsell_share_subscription_header_thank_you')}
        </Text>
        <Text type="h3-large" color="b100" align="center">
          {t('upsell_share_subscription_header_share')}
        </Text>
        <Text type="body2" color="b64" align="center" style={{ marginTop: 10 }}>
          {t('upsell_share_subscription_subtitle_list_email')}
        </Text>
        <Text
          type="body2"
          color="b100"
          align="center"
          style={{ marginTop: 10 }}>
          {t('upsell_share_subscription_do_later')}
        </Text>
        <div className="form col align-center">
          <img
            src="/static/images/familyPlan/form-background.png"
            alt="aura"
            className="background-gradient"
          />
          <div className={classNames('form-background row align-center')}>
            <div
              className={classNames(
                'checkbox clickable row align-center justify-center',
                {
                  'gradient-background': isChecked,
                }
              )}
              onClick={() => {
                setIsChecked(!isChecked);
              }}>
              {isChecked && (
                <img
                  src="/static/images/familyPlan/check.png"
                  alt="aura check"
                  className="check-icon"
                />
              )}
            </div>

            <Text
              type="footnote"
              color="b100"
              align="center"
              style={{ marginLeft: 8 }}>
              {t('upsell_share_subscription_people_in_household')}
            </Text>
          </div>

          {experiments &&
            familyPlanSeats &&
            familyPlanSeats.map((item) => (
              <FamilyPlanInviteInput
                type="text"
                fontType="body"
                color="b100"
                style={{ marginBottom: 12 }}
                placeholder={t('upsell_share_subscription_placeholder_email')}
                key={item}
                isChecked={isChecked}
                personNumber={item + 1}
                user={user}
                invitedUser={inviteList && Object.keys(inviteList)[item]}
                inviteList={inviteList}
              />
            ))}
          <AuraButtonSecondary
            title={t('upsell_share_subscription_button_next')}
            style={{ position: 'fixed', bottom: 40, zIndex: 2 }}
            onClick={onNext}
            experiments={experiments}
          />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
