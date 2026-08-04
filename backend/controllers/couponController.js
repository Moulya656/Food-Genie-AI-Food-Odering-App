const Coupon = require("../models/Coupon");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.validateCoupon = catchAsyncErrors(async (req, res) => {
  const { code, orderValue } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), active: true });

  if (!coupon) {
    return res.status(404).json({ success: false, message: "Invalid coupon code" });
  }
  if (coupon.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: "This coupon has expired" });
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
  }
  if (orderValue < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}`,
    });
  }

  const discount =
    coupon.discountType === "percentage"
      ? (orderValue * coupon.discountValue) / 100
      : coupon.discountValue;

  res.status(200).json({
    success: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discount: Math.round(discount * 100) / 100,
  });
});

exports.createCoupon = catchAsyncErrors(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

exports.getCoupons = catchAsyncErrors(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({ success: true, coupons });
});
