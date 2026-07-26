const referralConstants = Object.freeze({
  // Types
  TYPE_AMBASSADOR_30DAYS: 'ambassador_subscription_30trial',
  TYPE_INFLUENCER_SUBSCRIPTION_30TRIAL: 'influencer_subscription_30trial',
  TYPE_INFLUENCER_SUBSCRIPTION_25OFF_7TRIAL:
    'influencer_subscription_25off_7trial',
  TYPE_USER_SUBSCRIPTION_7TRIAL: 'user_subscription_7trial',
  TYPE_REFERRAL_SUBSCRIPTION_14TRIAL: 'referral_subscription_14trial',
  COACH_SUBSCRIPTION_30TRIAL: 'coach_subscription_30trial',
  TYPE_USER_SUBSCRIPTION_30TRIAL: 'user_subscription_30trial',
  TYPE_COACH_BM_COACHING: 'coach_bm_coaching',
  TYPE_CELEBRITY_SUBSCRIPTION: 'celebrity_subscription',
  TYPE_CHALLENGES_SUBSCRIPTION_30TRIAL: 'challenges_subscription_30trial',

  // aura social refer code
  REFER_CODE_AURA_SOCIAL: 'aura-social',

  SOURCE_AMBASSADOR: 'ambassador',
  SOURCE_INFLUENCER: 'influencer',
  SOURCE_REFERRAL_14DAYS_TRIAL: 'referral14t',
  SOURCE_USER_REFERRAL: 'userReferral',
  SOURCE_CHALLENGES_REFERRAL: 'challengesReferral',
  SOURCE_CONTENT_REFERRAL: 'contentReferral',
  SOURCE_INFLUENCER_REFERRAL: 'influencerReferral',
  SOURCE_GUEST_PASS_REFERRAL: 'guestpassReferral',
  SOURCE_LIVE_EVENT_REFERRAL: 'liveEventReferral',
  SOURCE_PLAYLIST_REFERRAL: 'playlistReferral',
  CHANNEL_EMAIL: 'Email',
  CHANNEL_COPY_LINK: 'CopyLink',

  MAX_MONTHLY_INVITES: 5,
  // Status
  STATUS_PENDING: 'pending',
  STATUS_QUALIFIED: 'qualified',
  STATUS_APPROVED: 'approved',
  STATUS_CREDITED: 'credited',
  STATUS_CANCELLED: 'cancelled',
  GUESTPASS_DISPLAY_STATUS: {
    pending: 'Started Guest Pass',
    credited: 'Successful Referral',
    cancelled: 'Cancelled Guest Pass',
  },
});

export default referralConstants;
