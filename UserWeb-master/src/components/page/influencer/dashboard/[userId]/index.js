import React, { useEffect, useState } from 'react';
import styles from './styles';
import usePageQuery from '../../../../../hooks/pageQuery';
import useAuthUser from '../../../../../hooks/authUser';
import useHandleServerDataError from '../../../../../hooks/handleServerDataError';
import {
  getUserReferralFriends,
  getUserReferrals,
} from '../../../../../models/user';
import referralConstants from '../../../../../utils/constants/referral';
import Text from '../../../../app/Text';
import GuestPassCard from '../../../../guestpass/GuestPassCard';
import GuestPassCount from '../../../../guestpass/GuestPassCount';
import Loader from '../../../../app/Loader';
import ShareLink from '../../../../guestpass/ShareLink';
import ShareViaEmail from '../../../../guestpass/ShareViaEmail';
import ReferralStatusCard from '../../../../guestpass/ReferralStatusCard';
import Analytics from '../../../../../services/Analytics';

const initialState = {
  allReferrals: [],
  referrals: [],
  invites: [],
  loading: true,
  referralCount: 0,
  invitesCount: 0,
  referralFriends: null,
};

function InfluencerUserId({ setIsInfluencer }) {
  const { user, error } = useAuthUser();
  const {
    utm_source = null,
    utm_campaign = null,
    userId,
  } = usePageQuery({
    fetchUserFromQuery: true,
  });

  useEffect(() => {
    if (user) {
      if (user.role !== 'influencer') {
        setIsInfluencer(false);
      } else {
        Analytics.track('Web Influencer Dashboard View', {
          UserID: user.id,
          attribution: utm_source,
          campaign: utm_campaign,
        });
      }
    }
  }, [user, utm_campaign, utm_source]);
  const [userReferrals, setUserReferrals] = useState(initialState);
  useHandleServerDataError(error);
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
        // Only show referrals that have corresponding entry on Firebase and are of type influencer
        referrals = referrals.filter((referral) => {
          const { type, referree } = referral;
          return (
            !!referralFriends[referree] &&
            type === referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_30TRIAL
          );
        });
        referrals.sort((a, b) => {
          return (
            new Date(b.statusAt).getTime() - new Date(a.statusAt).getTime()
          );
        });
        const allReferrals = referrals;
        referrals.forEach((referral) => {
          const { status } = referral;
          if (status === referralConstants.STATUS_CREDITED) {
            ambassadorReferrals.push(referral);
          }
          ambassadorInvites.push(referral);
        });
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
    ? `${process.env.NEXT_PUBLIC_APP_DOMAIN}/refer/${user.referralCode}?referralType=${referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_30TRIAL}&`
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
        <GuestPassCount
          invites={invitesCount}
          referrals={referralCount}
          style={{ marginTop: 56 }}
        />
      ) : (
        <Loader style={{ width: 48, height: 48 }} size={48} />
      )}
      <Text
        type="h4"
        color="b100"
        align="center"
        style={{ marginTop: 32, maxWidth: 926 }}>
        {`Aura Influencers are Aura’s influencer community committed to restoring the world’s emotional health by helping others find peace. Aura Influencers receive unlimited 30-day guest passes to share, and for every successful referral, earn $20 and have a subscription donated to a non-profit in their name.`}
      </Text>
      <div className="section-container">
        <Text type="h4" color="b100">
          Share Your Link
        </Text>
        <div className="section-card">
          <ShareLink
            link={userLink}
            referralCode={user && user.referralCode}
            referralType={
              referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_30TRIAL
            }
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
            referralType={
              referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_30TRIAL
            }
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

export default InfluencerUserId;
