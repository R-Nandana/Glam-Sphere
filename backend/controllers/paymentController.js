const asyncHandler = require("express-async-handler");

// Both SDKs are optional — only instantiated if keys are present, so the
// app still runs (with payments disabled) in a bare-bones dev setup.
const getRazorpay = () => {
  const Razorpay = require("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getStripe = () => require("stripe")(process.env.STRIPE_SECRET_KEY);

// @desc  Create a Razorpay order for a given amount (in paise)
// @route POST /api/payments/razorpay/order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  const instance = getRazorpay();
  const order = await instance.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `receipt_${Date.now()}`,
  });
  res.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
});

// @desc  Create a Stripe PaymentIntent
// @route POST /api/payments/stripe/intent
const createStripeIntent = asyncHandler(async (req, res) => {
  const { amount, currency = "inr" } = req.body;
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
  });
  res.json({ success: true, clientSecret: intent.client_secret });
});

module.exports = { createRazorpayOrder, createStripeIntent };
