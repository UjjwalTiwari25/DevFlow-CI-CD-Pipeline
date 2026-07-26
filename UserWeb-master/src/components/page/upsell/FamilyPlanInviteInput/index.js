import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import Text from '../../../app/Text';
import styles from './styles';
import { isValidEmail } from '../../../../utils/validators';
import Branch from '../../../../services/Branch';
import Logger from '../../../../services/Logger';
import {
  sentFamilyPlanInvite,
  setFamilyPlanInviteList,
} from '../../../../models/user';
import Analytics from '../../../../services/Analytics';
import appConstants from '../../../../utils/constants/app';
import { notifyHandledError } from '../../../../services/ErrorMonitoring';

function FamilyPlanInviteInput(
  {
    style,
    fontType,
    color,
    weight,
    align,
    error,
    personNumber,
    isChecked,
    user,
    invitedUser,
    inviteList,
    isDark,
    ...props
  },
  ref
) {
  const inputRef = useRef();
  const [email, setEmail] = useState(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const { currentLocale, t } = useTranslations();
  useEffect(() => {
    if (invitedUser) {
      setInviteSent(true);
      setEmail(Buffer.from(invitedUser, 'base64'));
    }
  }, [invitedUser]);

  const getLinkData = () => {
    const { id: userId, givenName } = user;
    if (!userId || !givenName || !email) {
      Logger.error('Invalid family plan invite link data', {
        userId,
        givenName,
        email,
      });
      return null;
    }
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
    };
    linkData.feature = `familyPlanInvite`;
    linkData.data = {
      primaryUserId: user.id,
      primaryUserName: user.givenName,
      invitedEmail: email,
      locale: currentLocale,
    };
    return linkData;
  };

  const generateBranchLink = () => {
    try {
      const linkData = getLinkData();
      return new Promise((resolve, reject) => {
        if (!linkData) reject();
        Branch.instance().link(linkData, (linkError, branchLink) => {
          if (linkError) {
            notifyHandledError(linkError, {
              message: 'Failed to generate link',
            });

            reject();
          }
          resolve(branchLink);
        });
      });
    } catch (err) {
      notifyHandledError(err, { message: 'Unique link failed' });
      setIsError(true);
      setErrorMessage(t('upsell_share_subscription_error_failed_to_generate'));
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    select: () => {
      inputRef.current.select();
    },
    value: inputRef.current.value,
  }));

  const setErrorMessageHandler = useCallback(
    (skipError) => {
      if (!email) {
        if (!skipError) {
          setIsError(true);
          setErrorMessage(t('upsell_share_subscription_error_email_required'));
        }
        return true;
      }
      if (!isChecked) {
        if (!skipError) {
          setIsError(true);
          setErrorMessage(t('upsell_share_subscription_error_please_certify'));
        }
        return true;
      }
      if (email && !isValidEmail(email)) {
        if (!skipError) {
          setIsError(true);
          setErrorMessage(t('upsell_share_subscription_error_email_not_exist'));
        }
        return true;
      }
      if (user && user.email === email) {
        if (!skipError) {
          setIsError(true);
          setErrorMessage(t('upsell_share_subscription_error_you_are_owner'));
        }
        return true;
      }
      return false;
    },
    [email, isChecked, user]
  );

  const onSubmit = async () => {
    try {
      setIsClicked(true);
      if (
        inviteList &&
        Object.keys(inviteList).includes(Buffer.from(email).toString('base64'))
      ) {
        setIsError(true);
        setErrorMessage(t('upsell_share_subscription_error_already_sent'));
        return;
      }
      if (!setErrorMessageHandler()) {
        const encodedEmail = Buffer.from(email).toString('base64');
        let deepLink;
        setTimeout(() => {
          if (!deepLink) {
            setIsError(true);
            setErrorMessage(
              t('upsell_share_subscription_error_failed_to_generate')
            );
          }
        }, 4000);
        deepLink = await generateBranchLink();
        if (!deepLink) {
          notifyHandledError(null, {
            message: 'Unable to generate family plan email invite deeplink',
          });
          setIsError(true);
          setErrorMessage(
            t('upsell_share_subscription_error_failed_to_generate')
          );
          return;
        }
        const res = await sentFamilyPlanInvite({
          isMale: user.gender === 'male',
          givenName: user.givenName,
          email,
          deepLink,
        });
        if (!res.error) {
          const newInvitesList = {
            ...(inviteList || {}),
            [encodedEmail]: true,
          };
          await setFamilyPlanInviteList({
            userId: user.id,
            data: newInvitesList,
          });
          setInviteSent(true);
          Analytics.track('Web Family Plan Invite', {
            InviteEmail: email,
            InviteNumber: personNumber,
          });
        }
      }
    } catch (err) {
      notifyHandledError(err, { message: 'Email not sent' });
      setIsError(true);
      setErrorMessage(t('upsell_share_subscription_error_failed_to_send'));
    }
  };

  const onChangeEmail = (evt) => {
    setEmail(evt.target.value?.trim());
  };

  return (
    <div
      className={classNames('main col', {
        'main-dark': isDark,
      })}>
      <Text type="body2" color={isDark ? 'b100' : 'b40'}>
        {t('upsell_share_subscription_member', {
          personNumber: I18NFormatter.formatNumber(personNumber),
        })}
      </Text>
      <div className="input-main row align-center">
        <div className={'input-container row align-center'} style={style}>
          <input
            ref={inputRef}
            onChange={onChangeEmail}
            value={email}
            className={`custom-input font custom-font ${fontType} ${color} ${weight} ${align} ${
              error && 'error-input'
            } ${isDark && 'custom-input-dark'}`}
            {...props}></input>
        </div>
        {!inviteSent ? (
          <img
            src="/static/images/familyPlan/invite.png"
            alt="aura invite"
            className="invite-icon clickable"
            onClick={() => {
              onSubmit();
            }}
          />
        ) : (
          <img
            src="/static/images/familyPlan/sent.png"
            alt="aura invite"
            className="invite-icon"
          />
        )}
      </div>
      {isClicked && isError && !inviteSent && (
        <Text type="body2" style={{ color: '#FF3B30' }}>
          {errorMessage}
        </Text>
      )}
      {isClicked && inviteSent && (
        <Text
          type="body2"
          style={{
            background: 'linear-gradient(to right, #5CE4B3, #CBE975, #9DD400)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}>
          {t('upsell_share_subscription_invite_sent')}
        </Text>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(FamilyPlanInviteInput);
