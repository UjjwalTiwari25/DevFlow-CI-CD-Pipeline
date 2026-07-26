import React, { useEffect } from 'react';
import useAuthUser from '../../../hooks/authUser';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import routeConstants from '../../../utils/constants/routes';
import AuraRing from '../../app/AuraRing';
import Text from '../../app/Text';
import GuestPassSteps from '../../guestpass/GuestPassSteps';
import NonProfitPartners from '../../guestpass/NonProfitPartners';
import Rewards from '../../guestpass/Rewards';
import ShareLink from '../../guestpass/ShareLink';
import ShareViaEmail from '../../guestpass/ShareViaEmail';
import styles from './styles';

export default function AmbassadorPage() {
  const { user } = useAuthUser();
  useEffect(() => {
    if (user) {
      window.location.replace(`/${routeConstants.PAGE_AMBASSADOR}/${user.id}`);
    }
  }, [user]);
  const [, isMobile] = useResponsiveWindow();
  return (
    <div className="page-content">
      <AuraRing />
      <Text
        color="b100"
        type="h4"
        component="h1"
        weight="regular"
        align="center"
        style={{
          marginTop: 16,
          marginBottom: 24,
        }}>
        Ambassador Dashboard
      </Text>
      {isMobile ? (
        <div />
      ) : (
        <div style={{ marginTop: 24 }}>
          <GuestPassSteps />{' '}
        </div>
      )}
      <div className="section-container">
        <div className="section-card">
          <Rewards />
        </div>
      </div>
      <div className="section-container">
        <Text type="h4" color="b100">
          Share Your Link
        </Text>
        <div className="section-card">
          <ShareLink link={null} />
        </div>
      </div>
      <div className="section-container">
        <Text type="h4" color="b100">
          Share via Email
        </Text>
        <div className="section-card">
          <ShareViaEmail link={null} />
        </div>
      </div>
      <div className="section-container">
        <Text type="h4" color="b100">
          Our Non-Profit Partners
        </Text>
        <Text type="body2" color="b100">
          For every successful referral, we will donate a free subscription to a
          charity of your choice
        </Text>
        <div className="section-card">
          <NonProfitPartners />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
