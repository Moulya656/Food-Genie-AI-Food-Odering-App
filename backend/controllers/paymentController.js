const Razorpay = require("razorpay");
const crypto = require("crypto");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

exports.createPaymentSession = catchAsyncErrors(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  });

  res.status(200).json({
    success: true,
    session: { id: order.id, amount: order.amount, currency: order.currency, status: order.status },
    key: process.env.RAZORPAY_KEY_ID,
  });
});

exports.verifyPayment = catchAsyncErrors(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  res.status(isValid ? 200 : 400).json({
    success: isValid,
    verified: isValid,
    paymentRef: razorpay_payment_id,
  });
});