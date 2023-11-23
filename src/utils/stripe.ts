import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_API_KEY, {
  apiVersion: import.meta.env.STRIPE_API_V,
});
export default stripe;

export async function getPrice(priceId: string) {
  const { unit_amount } = await stripe.prices.retrieve(priceId);

  return unit_amount ? unit_amount / 100 : null;
}

export async function getPrices(limit = 100) {
  const { data } = await stripe.prices.list({ limit });
  return data;
}

export async function createCheckoutSession(
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  customerEmail: string
) {
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    });

    if (!stripeSession.url) {
      throw new Error();
    }

    return stripeSession.url;
  } catch (e) {
    throw e;
  }
}
