import Stripe from "stripe";

export default new Stripe(import.meta.env.STRIPE_API_KEY, {
  apiVersion: import.meta.env.STRIPE_API_V,
});
