import { getSha1Hash, isProdMode } from '@/utils';
import Logger from './Logger';
import loadImpactUTT from './scripts/impact';

const isProd = isProdMode();

function isInitialized() {
  const isInit = typeof ire !== 'undefined';
  if (!isInit) Logger.debug('Impact pixel not initialized yet');
  return isInit;
}

function identify({ userId = '', email = '' } = {}) {
  Logger.debug('Identifying user on Impact', { userId, email });
  if (!isInitialized() || !isProd) return;
  const options = {
    customerId: userId,
    customerEmail: getSha1Hash(email),
  };
  ire('identify', options);
  Logger.debug('Identified user on Impact', options);
}

function trackTrialStart({
  subscriptionId,
  userId,
  email,
  promoCode = '',
  category,
  pricingId,
  pricingName,
}) {
  if (!isInitialized() || !isProd) return;
  ire(
    'trackConversion',
    41233,
    {
      orderId: subscriptionId,
      customerId: userId,
      customerEmail: getSha1Hash(email),
      currencyCode: 'USD',
      orderPromoCode: promoCode,
      orderDiscount: 0,
      items: [
        {
          subTotal: 0,
          category,
          sku: pricingId,
          quantity: 1,
          name: pricingName,
        },
      ],
    },
    {
      verifySiteDefinitionMatch: true,
    }
  );
}

function init() {
  Logger.debug('Initializing Impact');
  if (isInitialized() || !isProd) return;
  loadImpactUTT();
  Logger.debug('Initialized Impact');
  identify();
}

const ImpactPixel = {
  init,
  identify,
  trackTrialStart,
};

export default ImpactPixel;
