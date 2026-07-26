import { loadStripe } from '@stripe/stripe-js';
import config from '../config';

const stripePromise = loadStripe(config.stripe.stripeKey);

const Stripe = {
  instance: stripePromise,
};

export default Stripe;
