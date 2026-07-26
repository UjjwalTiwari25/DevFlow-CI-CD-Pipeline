import React, { useEffect, useState } from 'react';
import useAuthUser from '../../../../hooks/authUser';
import useHandleServerDataError from '../../../../hooks/handleServerDataError';
import usePageQuery from '../../../../hooks/pageQuery';
import {
  getUserReferralFriends,
  getUserReferrals,
} from '../../../../models/user';
import Analytics from '../../../../services/Analytics';
import referralConstants from '../../../../utils/constants/referral';
import Loader from '../../../app/Loader';
import ProgressBar from '../../../app/ProgressBar';
import Text from '../../../app/Text';
import GuestPassCard from '../../../guestpass/GuestPassCard';
import GuestPassCount from '../../../guestpass/GuestPassCount';
import ReferralStatusCard from '../../../guestpass/ReferralStatusCard';
import ShareLink from '../../../guestpass/ShareLink';
import ShareViaEmail from '../../../guestpass/ShareViaEmail';
import styles from './styles';

const initialState = {
  allReferrals: [],
  referrals: [],
  invites: [],
  loading: true,
  referralCount: 0,
  invitesCount: 0,
  referralFriends: null,
};

export default function AmbassadorId() {
  const {
    userId,
    utm_source = null,
    utm_campaign = null,
  } = usePageQuery({
    fetchUserFromQuery: true,
  });
  const [userReferrals, setUserReferrals] = useState(initialState);
  const { user, error } = useAuthUser();

  useHandleServerDataError(error);
  useEffect(() => {
    if (user) {
      Analytics.track('Web Ambassador Dashboard View', {
        UserID: user.id,
        attribution: utm_source,
        campaign: utm_campaign,
      });
    }
  }, [user, utm_source, utm_campaign]);
  useEffect(() => {
    if (!userId) {
      return;
    }

    async function fetchUserReferrals() {
      let referrals = await getUserReferrals(userId);
      const referralFriends = await getUserReferralFriends(userId);
      if (referrals && referrals.length && referralFriends) {
        const ambassadorReferrals = [];
        const ambassadorInvites = [];
        referrals = referrals.filter((referral) => {
          const { type, referree } = referral;
          return (
            !!referralFriends[referree] &&
            type === referralConstants.TYPE_AMBASSADOR_30DAYS
          );
        });
        referrals.sort((a, b) => {
          return (
            new Date(b.statusAt).getTime() - new Date(a.statusAt).getTime()
          );
        });
        referrals.forEach((referral) => {
          const { status } = referral;
          if (status === referralConstants.STATUS_CREDITED) {
            ambassadorReferrals.push(referral);
          }
          ambassadorInvites.push(referral);
        });
        const allReferrals = referrals;
        setUserReferrals({
          referrals: ambassadorReferrals,
          referralCount: ambassadorReferrals.length,
          invites: ambassadorInvites,
          invitesCount: ambassadorInvites.length,
          loading: false,
          allReferrals,
          referralFriends,
        });
      }
    }
    fetchUserReferrals();
  }, [userId]);

  const userLink = user
    ? `${process.env.NEXT_PUBLIC_APP_DOMAIN}/refer/${user.referralCode}?`
    : null;
  const { referralCount, invitesCount, referralFriends, allReferrals } =
    userReferrals;
  return (
    <div className="page-content">
      <Text
        type="h4"
        component="h1"
        color="b100"
        align="center"
        style={{ marginBottom: 32 }}>
        Hi {user && `${user.givenName}!`}
      </Text>
      <GuestPassCard />
      <Text type="h3" color="b100" align="center" style={{ marginTop: 24 }}>
        Share 30-Day Aura Guest Passes for free
      </Text>
      <Text
        type="h4"
        color="b100"
        align="center"
        style={{ maxWidth: 380, marginTop: 16 }}>
        Help them sleep better and find peace with unlimited access to premium
      </Text>

      {user ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <GuestPassCount
            invites={invitesCount}
            referrals={referralCount}
            style={{ marginTop: 56 }}
          />
          <ProgressBar
            style={{
              opacity: 1,
              width: '100%',
              height: 4,
              marginBottom: 16,
              maxWidth: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 42,
            }}
            startColor="#05cbf2"
            endColor="#05cbf2"
            step={referralCount}
            total={2}
            showStepCounter={true}
          />
          <div
            style={{
              display: 'inline-flex',
              marginTop: 42,
              maxWidth: 926,
            }}>
            <Text type="h4" color="b100" align="center">
              {`You are only ${
                2 - referralCount > 1
                  ? '2 referrals'
                  : `${2 - referralCount} referral`
              } away from becoming an `}
              <span style={{ color: '#05cbf2' }}>Aura Ambassador</span>
            </Text>
          </div>
        </div>
      ) : (
        <Loader style={{ width: 48, height: 200 }} size={100} />
      )}

      <Text
        type="h4"
        color="b100"
        align="center"
        style={{ marginTop: 32, maxWidth: 926 }}>
        {`Aura Ambassadors are Aura’s brand community committed to restoring the world’s emotional health by helping others find peace. Aura Ambassadors receive unlimited 30-day guest passes, earn Aura swag, get early access to features, and much more.`}
      </Text>
      <div className="section-container">
        <Text type="h4" color="b100">
          Share Your Link
        </Text>
        <div className="section-card">
          <ShareLink
            link={userLink}
            referralCode={user && user.referralCode}
            referralType={referralConstants.TYPE_AMBASSADOR_30DAYS}
          />
        </div>
      </div>
      <div className="section-container">
        <Text type="h4" color="b100">
          Share via Email
        </Text>
        <div className="section-card">
          <ShareViaEmail
            link={userLink}
            referralCode={user && user.referralCode}
            referralType={referralConstants.TYPE_AMBASSADOR_30DAYS}
          />
        </div>
      </div>

      <div className="section-container">
        <Text type="h4" color="b100">
          Your Referrals
        </Text>
        <div className="section-card">
          <ReferralStatusCard
            referralFriends={referralFriends}
            referrals={allReferrals}
          />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
