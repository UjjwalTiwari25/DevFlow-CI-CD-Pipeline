export const PAYWALL_TYPE = {
  WEBVIEW: 'WebView',
  NATIVE: 'Native',
  STRIPE_CHECKOUT: 'Stripe Checkout',
};

export function getPaywallAnalyticsProperties({
  redirectedFromApp = false,
  paywallType = PAYWALL_TYPE.WEBVIEW,
} = {}) {
  return {
    'Paywall Type': paywallType,
    'Redirected From App': !!redirectedFromApp,
  };
}
