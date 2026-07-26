import React, { useCallback, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import classNames from 'classnames';
import { getCoachName, getCoachPhoto } from '@/models/coach';
import MobileAppDownload from '@/components/app/MobileAppDownload';
import Text from '@/components/app/Text';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import useTranslations from '@/hooks/translations';
import AuraButton from '@/components/app/AuraButton';
import Loader from '@/components/app/Loader';
import appConstants from '@/utils/constants/app';
import Branch from '../../../services/Branch';
import Logger from '../../../services/Logger';
import styles from './styles.module.scss';

function Congrats({ community, user, coach }) {
  const { id: communityId, image, name } = community;
  const [, isMobile] = useResponsiveWindow();
  const [deeplink, setDeepLink] = useState(null);
  const { currentLocale, t } = useTranslations();
  const { id: userId, givenName, provider } = user || {};

  const { referrer, utm: { utm_source, utm_campaign } = {} } =
    useShallowEqualSelector(({ payment }) => payment);

  const getLinkData = useCallback(() => {
    const linkData = {
      channel: appConstants.DEEPLINK_CHANNEL,
      feature: 'community',
      data: {
        communityId,
        userId,
        userName: givenName,
        communityName: name,
        communityImage: image,
        communityOwnerId: coach?.id,
        communityOwnerName: getCoachName(coach),
        source: utm_source || 'community',
        campaign: utm_campaign,
        locale: currentLocale,
        loginProvider: provider,
      },
    };
    if (referrer) {
      linkData.data.referrerName = referrer.givenName;
      linkData.data.referrerId = referrer.id;
    }
    return linkData;
  }, [currentLocale, communityId, userId, givenName, provider, name, image]);

  const generateBranchLink = useCallback(() => {
    const linkData = getLinkData();
    return new Promise((resolve, reject) => {
      Branch.instance().link(linkData, (linkError, branchLink) => {
        if (linkError) {
          Logger.error('Failed to generate link', { linkError });
          reject();
        }
        resolve(branchLink);
      });
    });
  }, [getLinkData]);

  useEffect(() => {
    async function generateDeepLink() {
      const mobileDeepLink = await generateBranchLink();
      setDeepLink(mobileDeepLink);
    }
    if (user) {
      generateDeepLink();
    }
  }, [generateBranchLink, user]);

  return (
    <div className={styles.main}>
      <div className={styles.outerWrap}>
        <div className={classNames('w-100 row align-items', styles.nav)}>
          <img
            src="/static/images/logoHorizontal.png"
            alt="aura-logo"
            className={styles.auraLogoWithText}
          />
        </div>
        <div className={styles.coachRowInfo}>
          <div className={styles.frameContainer}>
            <img
              src="/static/images/coachingSession/frame-large.png"
              alt="aura"
              className={styles.frame}
            />
            <div className={styles.infoContainer}>
              <img
                src={getCoachPhoto(coach)}
                alt=""
                className={styles.communityCoachImage}
              />
              <div className={styles.community}>
                <Text type="cta" color="b100" align="center" weight="semibold">
                  {name}
                </Text>
                <Text
                  type="footnote"
                  color="b100"
                  align="center"
                  style={{ marginTop: 4, marginBottom: 10 }}>
                  {t('community_congrats_label')}
                </Text>
                <Text type="footnote" color="g50" align="center">
                  {t('community_congrats_sub_label')}
                </Text>

                <img
                  src="/static/images/coachingSession/greenCheck.png"
                  alt="aura green check"
                  className={styles.greenCheck}
                />
              </div>
            </div>
          </div>
          <hr className={styles.hr} />
          <Text
            type={isMobile ? 'h3-large' : 'h2'}
            color="b100"
            align="center"
            weight="semibold"
            style={{ marginTop: 24, lineHeight: isMobile && '29px' }}>
            {t('community_congrats_congratulations_text', {
              communityName: community?.name,
            })}
          </Text>
          <Text
            type={isMobile ? 'h4' : 'h3'}
            color="g50"
            align="center"
            weight="medium"
            style={{ lineHeight: isMobile && '29px' }}>
            {t('community_congrats_manage_reservations')}
          </Text>

          {!deeplink && <Loader style={{ width: '100', height: '100%' }} />}

          {!isMobile && (
            <div className={styles.smsButtonContainer}>
              {deeplink && <QRCodeCanvas value={deeplink} size={150} />}
              <MobileAppDownload style={{ marginTop: 24 }} />
            </div>
          )}
          {isMobile && deeplink && (
            <AuraButton
              cleanStyle
              textWeight="bold"
              title={
                <a
                  href={deeplink}
                  style={{
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#fff',
                  }}>
                  {t('community_congrats_open_aura_app')}
                </a>
              }
              style={{
                marginTop: 34,
                width: '100%',
                height: '65px',
                borderRadius: '99px',
              }}
              withShadow
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Congrats;
