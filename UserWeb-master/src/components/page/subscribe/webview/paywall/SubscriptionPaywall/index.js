import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';
import { setUTM } from '@/store/slices/payment';
import usePageQuery from '@/hooks/pageQuery';
import useStripeCard from '@/hooks/stripeCard';
import { WEBVIEW_SOURCE_PLATFORM } from '@/models/payment';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import Analytics from '@/services/Analytics';
import styles from './style.module.scss';

const StripeModal = dynamic(() => import('./StripeModal'), { ssr: false });

const BULLET_TEXTS = [
  'Aura understands your emotions & helps you feel better in as little as 3 minutes',
  'Fall asleep, calm anxiety, & reduce stress effortlessly whenever you need',
  'Find peace & balance and step into your day feeling fully in control',
  'Access 10,000+ meditations, life coaching, stories, and music from top coaches & therapists',
];

const REVIEWS = [
  {
    name: 'Julie',
    avatar: '/static/images/paywall/julieAvatar.webp',
    subtitle: 'Aura member for two years',
    review:
      'Aura has become part of my daily habits and routine. It has eased my depression on days when I am down and helped me focus on days when I had to tackle a major project. Having said that, I use it for all sorts of situations.',
  },
  {
    name: 'David',
    avatar: '/static/images/paywall/davidAvatar.webp',
    subtitle: 'Aura member for two years',
    review:
      'Aura is like having a therapist, personal life coach, guru & sleep buddy all wrapped into one. Aura allowed me to find myself & believe in who I am again',
  },
  {
    name: 'Carly',
    avatar: '/static/images/paywall/carlyAvatar.webp',
    subtitle: 'Aura member for one year',
    review: `Aura is by far the best meditation application i ever used. Every single time I get to fall asleep peacefully and wake up rested. Aura's personalization is magical and knows just what works for me. Thank you!`,
  },
];

function AppleIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 814 1000" fill="#999">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.5-81.8-105.6-209.2-105.6-330.5C-.1 280 83.8 171.5 207.8 171.5c63.5 0 116.4 41.8 156.2 41.8 37.5 0 96.2-44.2 168.9-44.2 27.2 0 125 2.5 189.2 96.3v75.5zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.6 15.7 1.3 18.2 2.5.6 6.4.6 10.2.6 45.5.1 102.5-30.4 139.5-70.7z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3m7-2V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SOCIAL_PROOF = [
  {
    IconComponent: AppleIcon,
    iconClass: 'spIconApple',
    rating: 4.7,
    title: '4.7 Stars',
    subtitle: 'App Store Rating',
  },
  {
    IconComponent: DownloadIcon,
    iconClass: 'spIconLarge',
    title: '8M+',
    subtitle: 'Downloads',
  },
  {
    IconComponent: ThumbIcon,
    iconClass: 'spIconLarge',
    title: '45k+',
    subtitle: '5-Star Ratings',
  },
];

function getYearlyPrice(plans) {
  return plans?.yearly?.discountedPricing?.replace(' USD', '') || '$69.99';
}

function getCtaText(plan) {
  if (plan === 'yearly') return 'Start free trial';
  if (plan === 'sixMonth') return 'Redeem 6 months';
  return 'Redeem 1 month';
}

function getOfferBoldText(plan, plans) {
  if (plan === 'yearly') {
    const price = getYearlyPrice(plans);
    return `Try 7 days for free, then ${price}/year`;
  }
  if (plan === 'sixMonth') return '$49.99 every 6 months';
  const yearlyPrice = getYearlyPrice(plans);
  return `$4.99 for first month, then ${yearlyPrice}/year`;
}

function getTotalDueToday(plan) {
  if (plan === 'monthlyIntro') return '$4.99';
  if (plan === 'sixMonth') return '$49.99';
  return '$0';
}

function getOfferRegularText(plan, plans) {
  if (plan === 'yearly') {
    const monthly = plans?.yearly?.monthlyPricing || '$5.83';
    return `(only ${monthly}/mo). Cancel anytime.`;
  }
  if (plan === 'sixMonth') return '(only $8.33/mo). Cancel anytime.';
  if (plan === 'monthlyIntro') {
    const monthly = plans?.monthlyIntro?.monthlyPricing || '$5.83';
    return `(only ${monthly}/mo). Cancel anytime.`;
  }
  return 'Cancel anytime.';
}

function getStarFill(s, rating) {
  if (s <= Math.floor(rating)) return '#FFD02B';
  if (s - 0.5 <= rating) return '#FFD02B';
  return 'rgba(255,255,255,0.3)';
}

const SubscriptionPaywall = ({
  user,
  plans,
  selectedPlan,
  ctaAtBottom = false,
  onPlanChange,
  onClose,
  onSuccessfulSubscription,
  onPaymentInitiated,
  onFailedSubscription,
}) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const { pricing } = useShallowEqualSelector(({ payment }) => payment);
  const [showOtherPlans, setShowOtherPlans] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  // Tracks whether the user pressed Submit inside the Stripe card modal.
  // Used to distinguish "closed without trying" (fires payment_error for
  // native parity with IAP-sheet cancel) from "submitted then closed after
  // seeing an error" (payment_error already fired from useStripeCard, no
  // need to fire again on close).
  const stripeFormSubmittedRef = useRef(false);
  const yearlyPrice = getYearlyPrice(plans);
  const totalDueToday = getTotalDueToday(selectedPlan);

  const {
    utm_source = null,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
    campaign = null,
  } = usePageQuery();

  const {
    canShowPaymentRequest,
    handlePaymentRequestSubmit,
    handleSubmit,
    loading,
  } = useStripeCard({
    showQuickCheckout: !!pricing,
    onSuccessfulSubscription,
    onFailedSubscription,
    stripe,
    // Webview-only paywall: purchases originate from the Aura mobile app, so
    // tag the subscription with the mobile platform rather than relying on
    // runtime webview detection.
    sourcePlatform: WEBVIEW_SOURCE_PLATFORM,
  });

  useEffect(() => {
    dispatch(
      setUTM({
        attribution: utm_source,
        campaign: utm_campaign || campaign,
        medium: utm_medium,
        content: utm_content,
      })
    );
  }, [campaign, dispatch, utm_campaign, utm_content, utm_medium, utm_source]);

  const handleCTAClick = () => {
    const plan = plans?.[selectedPlan];
    if (!plan || !user?.id) return;
    Analytics.track('Paywall CTA Tapped', {
      UserID: user.id,
      Plan: selectedPlan,
      PricingID: plan.id,
    });
    // Mirror to mobile so it can fire `Subscription purchase try` in the same
    // Mixpanel session that owns the existing native funnel (PROD-1571).
    if (typeof onPaymentInitiated === 'function') {
      onPaymentInitiated();
    }
    if (canShowPaymentRequest) {
      handlePaymentRequestSubmit();
    } else {
      setShowStripeModal(true);
    }
  };

  const handleRestore = () => {
    Analytics.track('Restore Purchase Tapped', { UserID: user?.id });
    try {
      const data = JSON.stringify({ type: 'restore_purchase' });
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(data);
      }
    } catch (e) {
      // silently fail
    }
  };

  // CTA button + pricing caption. Rendered inline between the plan cards and
  // the "How I can cancel?" section by default; relocated to the very bottom of
  // the scroll for the auraPaywallCTAPosition 'a' variant (ENGMOB-1908). The
  // plan cards stay in place either way; `selectedPlan` is owned by the parent
  // container so the button text/caption update live regardless of position.
  const renderCtaBlock = () => (
    <>
      {/* CTA Button */}
      <div className={styles.ctaWrap}>
        <button
          type="button"
          className={styles.ctaButton}
          onClick={handleCTAClick}>
          <div className={styles.ctaPulseRing} />
          <div className={styles.ctaPulseRing2} />
          <div className={styles.ctaGradient} />
          <span className={styles.ctaText}>{getCtaText(selectedPlan)}</span>
        </button>
      </div>

      <div style={{ height: 15 }} />

      {/* Pricing details below CTA */}
      <p className={styles.offerTextBold}>
        {getOfferBoldText(selectedPlan, plans)}
      </p>
      <p className={styles.offerTextRegular}>
        {getOfferRegularText(selectedPlan, plans)}
      </p>
    </>
  );

  return (
    <div className={styles.gridContainer}>
      <div className={styles.scroll}>
        <div style={{ height: 48 }} />

        {/* Best of Apple Award Winner */}
        <div className={styles.boaContainer}>
          <div className={styles.boaBgWrap}>
            <img
              src="/static/images/paywall/bestOfAppleNewFeather.webp"
              alt=""
              className={styles.boaFeatherImg}
              fetchPriority="high"
              width={150}
              height={57}
            />
            <img
              src="/static/images/paywall/appleNew.webp"
              alt="Apple"
              className={styles.boaAppleIcon}
              fetchPriority="high"
              width={40}
              height={30}
            />
          </div>
          <div style={{ height: 4 }} />
          <p className={styles.boaText}>Best of Apple Award Winner</p>
        </div>

        <div style={{ height: 18 }} />

        {/* Title */}
        <h1 className={styles.freeTrialH4}>How your free trial works</h1>

        {/* Subtitle */}
        <p className={styles.freeSubTitle}>Loved by 8 million+ people</p>

        {/* 50% off gradient pill */}
        <div className={styles.pillWrap}>
          <div className={styles.gradientPill}>
            <span className={styles.gradientPillText}>
              50% off yearly subscription
            </span>
          </div>
        </div>

        {/* Total due today */}
        <div className={styles.totalDueTopWrap}>
          <div style={{ height: 30 }} />
          <p className={styles.totalDueTopText}>
            Total due today: {totalDueToday}
          </p>
        </div>

        {/* Trial timeline */}
        <div className={styles.timelineWrap}>
          <div className={styles.tlImageCol}>
            <img
              src="/static/images/paywall/paywallTimelineGreen.webp"
              alt=""
              className={styles.tlImage}
            />
          </div>
          <div className={styles.timelineTextsCol}>
            <div className={styles.tlTextBlock1}>
              <span
                className={styles.tlTitleGreen}
                style={{ textDecoration: 'line-through' }}>
                Install the app
              </span>
              <p className={styles.tlDesc}>
                You successfully created your profile
              </p>
            </div>
            <div className={styles.tlTextBlock}>
              <span className={styles.tlTitle}>Today: Get Instant Access</span>
              <p className={styles.tlDesc}>
                Start your full access to all premium content
              </p>
            </div>
            <div className={styles.tlTextBlock}>
              <span className={styles.tlTitle}>Day 5: Trial Reminder</span>
              <p className={styles.tlDesc}>
                Get a reminder about when your trial will end
              </p>
            </div>
            <div className={styles.tlTextBlock}>
              <span className={styles.tlTitle}>Day 7: Trial Ends</span>
              <p className={styles.tlDesc}>
                You&apos;ll be charged on this day, cancel anytime before
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 8 }} />
        <div className={styles.lineDiv} />
        <div style={{ height: 22 }} />
        <h2 className={styles.tryTitle}>Try Aura For:</h2>
        <div style={{ height: 22 }} />

        {/* Plan cards */}
        <div className={styles.offerCards}>
          <p className={styles.sectionHeader}>Yearly plans</p>

          {plans.yearly && (
            <button
              type="button"
              className={styles.offerCard}
              onClick={() => onPlanChange('yearly')}>
              <div className={styles.offerCardBg} />
              <div className={styles.offerCardContent}>
                <div className={styles.offerCardLeft}>
                  <div className={styles.offerTitleRow}>
                    <span className={styles.offerCardTitle}>Yearly</span>
                    <span className={styles.greenBadge}>Free Trial</span>
                  </div>
                  <span className={styles.offerCardSub}>
                    {`7-day trial then ${yearlyPrice}/year`}
                  </span>
                </div>
                <div
                  className={
                    selectedPlan === 'yearly'
                      ? styles.radioSelected
                      : styles.radioUnselected
                  }
                />
              </div>
            </button>
          )}

          {plans.monthlyIntro && (
            <button
              type="button"
              className={styles.offerCard}
              onClick={() => onPlanChange('monthlyIntro')}>
              <div className={styles.offerCardBg} />
              <div className={styles.offerCardContent}>
                <div className={styles.offerCardLeft}>
                  <span className={styles.offerCardTitle}>1 Month: $4.99</span>
                  <span className={styles.offerCardSub}>
                    then{' '}
                    {plans?.yearly?.discountedPricing?.replace(' USD', '') ||
                      '$69.99'}
                    /year
                  </span>
                </div>
                <div
                  className={
                    selectedPlan === 'monthlyIntro'
                      ? styles.radioSelected
                      : styles.radioUnselected
                  }
                />
              </div>
            </button>
          )}

          {/* View other plans toggle */}
          <button
            type="button"
            className={styles.viewOtherPlans}
            onClick={() => setShowOtherPlans((prev) => !prev)}>
            <span className={styles.viewOtherPlansText}>View other plans</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className={styles.viewOtherPlansArrow}
              style={{
                transform: showOtherPlans ? 'rotate(90deg)' : 'rotate(270deg)',
              }}>
              <path
                d="M15 18l-6-6 6-6"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 6-month plan (revealed on toggle) */}
          {showOtherPlans && plans.sixMonth && (
            <>
              <p className={styles.sectionHeader}>6 month plans</p>
              <button
                type="button"
                className={styles.offerCard}
                onClick={() => onPlanChange('sixMonth')}>
                <div className={styles.offerCardBg} />
                <div className={styles.offerCardContent}>
                  <div className={styles.offerCardLeft}>
                    <span className={styles.offerCardTitle}>
                      6 Months: $49.99
                    </span>
                    <span className={styles.offerCardSub}>
                      $49.99 every 6 months
                    </span>
                  </div>
                  <div
                    className={
                      selectedPlan === 'sixMonth'
                        ? styles.radioSelected
                        : styles.radioUnselected
                    }
                  />
                </div>
              </button>
            </>
          )}
        </div>

        {/* CTA block renders here for control; auraPaywallCTAPosition 'a'
            relocates it to the paywall bottom (after Restore Purchases). */}
        {!ctaAtBottom && (
          <>
            <div style={{ height: 5 }} />
            {renderCtaBlock()}
          </>
        )}

        {/* "How I can cancel?" */}
        <div style={{ height: 24 }} />
        <div className={styles.cancelSection}>
          <p className={styles.cancelTitle}>How I can cancel?</p>
          <div style={{ height: 5 }} />
          <p className={styles.cancelBody}>
            In just a few simple steps: Access the &apos;Me&apos; tab, proceed
            to settings, and select &apos;Edit account&apos; to find the option
            to cancel your subscription.
          </p>
        </div>
        <div style={{ height: 30 }} />

        {/* "What if I forget to cancel?" */}
        <div className={styles.forgetWrap}>
          <span className={styles.forgetText}>What if I forget to cancel?</span>
          <div className={styles.forgetLine} />
        </div>

        {/* Media logos (social proof image) */}
        <div className={styles.mediaLogosWrap}>
          <img
            src="/static/images/paywall/socialProofNew.webp"
            alt="Featured in TIME, Oprah Magazine, TechCrunch, Forbes, mindful, NBC, cnet"
            className={styles.mediaLogosImg}
            loading="lazy"
          />
        </div>

        <div style={{ height: 34 }} />
        <BulletList />

        {/* Social proof cards + Donation (inside rainbow bg) */}
        <div className={styles.socialProofBg}>
          <div className={styles.socialProofRow}>
            <SocialProofCard {...SOCIAL_PROOF[0]} />
            <div style={{ width: 15, flexShrink: 0 }} />
            <SocialProofCard {...SOCIAL_PROOF[1]} />
          </div>
          <div style={{ height: 16 }} />
          <div className={styles.socialProofRow}>
            <SocialProofCard {...SOCIAL_PROOF[2]} />
          </div>
          <div style={{ height: 30 }} />
          <div className={styles.donateRow}>
            <img
              src="/static/images/paywall/purchaseSupportIcon.webp"
              alt=""
              className={styles.donateIcon}
              loading="lazy"
            />
            <p className={styles.donateRowText}>
              Your purchase supports our coaches & helps us offer Aura for free
              to those in need
            </p>
          </div>
        </div>

        <div className={styles.lineDiv} />

        {/* Reviews */}
        <div style={{ height: 40 }} />
        <p className={styles.reviewsHeading}>Loved by 8 million+ people</p>
        <div className={styles.reviewsScroll}>
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>

        <div className={styles.lineDiv} />

        <div style={{ height: 34 }} />

        <p className={styles.noCommitmentText}>
          No commitments, cancel anytime
        </p>

        <div style={{ height: 24 }} />

        <div className={styles.termsWrap}>
          <p className={styles.termsText}>
            After free trial, Aura yearly subscription is {yearlyPrice} and
            automatically renews unless auto-renew is turned off at least 24h
            before current period ends. Payment is charged to your iTunes
            account. Manage subscriptions and turn off auto-renewal in Account
            Settings.{' '}
            <a
              href="https://www.aurahealth.io/terms"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.termsLink}>
              Terms
            </a>
            {' and '}
            <a
              href="https://www.aurahealth.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.termsLink}>
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div style={{ height: 24 }} />

        <div className={styles.restoreWrap}>
          <button
            type="button"
            className={styles.restoreBtn}
            onClick={handleRestore}>
            Restore Purchases
          </button>
        </div>

        {/* auraPaywallCTAPosition 'a': CTA relocated to the very bottom of the
            scroll, mirroring the native paywall (plan cards stay in place). */}
        {ctaAtBottom && (
          <div className={styles.bottomCta}>
            <div style={{ height: 24 }} />
            {renderCtaBlock()}
          </div>
        )}

        <div style={{ height: 34 }} />
      </div>

      <button className={styles.closeButton} onClick={onClose} type="button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M1 1L15 15M15 1L1 15"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {showStripeModal && (
        <StripeModal
          handleSubmit={(evt) => {
            stripeFormSubmittedRef.current = true;
            return handleSubmit(evt);
          }}
          loading={loading}
          onClose={() => {
            // Closed without submitting → mirror native IAP-sheet cancel
            // by firing payment_error (PROD-1571). If the user submitted
            // and saw an error, useStripeCard already fired it; don't
            // double-fire on the subsequent close.
            if (
              !stripeFormSubmittedRef.current &&
              typeof onFailedSubscription === 'function'
            ) {
              onFailedSubscription({
                error: 'user_cancelled_card_modal',
                errorCode: 'user_cancelled',
              });
            }
            stripeFormSubmittedRef.current = false;
            setShowStripeModal(false);
          }}
        />
      )}
    </div>
  );
};

function BulletList() {
  return (
    <div className={styles.bulletList}>
      {BULLET_TEXTS.map((text, i) => (
        <div key={i} className={styles.bulletItem}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className={styles.bulletCheckImg}>
            <circle cx="11" cy="11" r="11" fill="#00E5FF" />
            <path
              d="M6.5 11.5l3 3 6-6"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ width: 10, flexShrink: 0 }} />
          <span className={styles.bulletText}>{text}</span>
        </div>
      ))}
    </div>
  );
}

function SocialProofCard({
  IconComponent,
  iconClass,
  rating,
  title,
  subtitle,
}) {
  return (
    <div className={styles.spCard}>
      <div className={styles[iconClass]}>
        <IconComponent />
      </div>
      {rating && (
        <div className={styles.spStars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={getStarFill(s, rating)}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      )}
      <p className={styles.spTitle}>{title}</p>
      <p className={styles.spSubtitle}>{subtitle}</p>
    </div>
  );
}

function ReviewCard({ name, avatar, subtitle, review }) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewStars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="#FFD02B">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p className={styles.reviewText}>{review}</p>
      <div className={styles.reviewUser}>
        <img
          src={avatar}
          alt={name}
          className={styles.reviewAvatar}
          loading="lazy"
          width={40}
          height={40}
        />
        <div className={styles.reviewNameWrap}>
          <p className={styles.reviewName}>{name}</p>
          <p className={styles.reviewSubtitle}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPaywall;
