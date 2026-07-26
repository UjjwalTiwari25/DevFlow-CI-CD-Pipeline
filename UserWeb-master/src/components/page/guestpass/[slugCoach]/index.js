import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useRouter } from 'next/router';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import styles, { renderCTAStyle } from './styles';
import routeConstants from '../../../../utils/constants/routes';
import Text from '../../../app/Text';
import CoachGuestPassContent from '../../../coachGuestpassContent';
import { generateQueryPath } from '../../../../utils';
import AuraRing from '../../../app/AuraRing';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import referralConstants from '../../../../utils/constants/referral';
import usePageQuery from '../../../../hooks/pageQuery';

export default function GuestPassCoachSlug({ user, coach, tracks }) {
  const [, isMobile] = useResponsiveWindow();
  const { name, profilePicture } = coach;
  const { t, currentLocale } = useTranslations();

  return (
    <div>
      <div className="page-content">
        <div className="logo">
          <AuraRing style={{ width: 34, height: 34, marginLeft: 6 }} />
          <Text type="body" color="b100" weight="regular">
            {t('guestpass_header_aura')}
          </Text>
        </div>
        <img alt="avatar" className="avatar" src={profilePicture} />

        <Text
          component="h1"
          type={isMobile ? 'h3-large' : 'h2'}
          align="center"
          color="b100"
          style={{
            maxWidth: isMobile && 250,
            border: '1px solid rgb(0, 0, 0, 0)',
          }}>
          {t('guestpass_claim_guest_pass', { count: 30, coachName: name })}
        </Text>

        {isMobile && (
          <img
            className="guest-pass-card"
            src={getLocaleImage('/static/images/guestPass.png', currentLocale)}
            alt="Guest Pass Card"
          />
        )}
        <Text
          component={isMobile ? 'div' : 'h3'}
          type={isMobile ? 'body' : 'h3'}
          align="center"
          color="b100"
          style={{
            marginTop: isMobile ? 32 : 18,
            marginBottom: 12,
            width: isMobile ? 260 : 'auto',
          }}>
          {t('guestpass_find_peace')}
        </Text>
        <div className="render-btn">
          <RenderCTA
            user={user}
            style={{
              marginTop: isMobile ? '0px' : 38,
            }}
          />
        </div>
      </div>
      {coach && (
        <CoachGuestPassContent
          coach={coach}
          tracks={tracks}
          renderCTA={<RenderCTA user={user} />}
        />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

function RenderCTA({ user, style }) {
  const {
    utm_source = referralConstants.SOURCE_AMBASSADOR,
    utm_campaign = referralConstants.SOURCE_AMBASSADOR,
    referralType = referralConstants.COACH_SUBSCRIPTION_30TRIAL,
  } = usePageQuery();
  const router = useRouter();
  const { t } = useTranslations();

  return (
    <div className="btn-primary clickable" style={style || { marginTop: 38 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onClick={() => {
          const path = generateQueryPath(routeConstants.PAGE_SIGNUP, {
            utm_source,
            utm_campaign,
            referralCode: user.referralCode,
            referralType,
          });
          router.push(path);
        }}>
        <Text
          type="body"
          color="w100"
          weight="regular"
          align="center"
          style={{ padding: 5 }}>
          {t('guestpass_button_redeem')}
        </Text>
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 24,
            marginTop: 8,
          }}>
          <IoIosArrowForward />
        </div>
      </div>
      <style jsx>{renderCTAStyle}</style>
    </div>
  );
}
