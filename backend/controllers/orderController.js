const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.createOrder = catchAsyncErrors(async (req, res) => {
  const {
    cook,
    items,
    subtotal,
    deliveryFee,
    discount,
    couponApplied,
    total,
    deliveryAddress,
    paymentMethod,
  } = req.body;

  const order = await Order.create({
    user: req.user.id,
    cook,
    items,
    subtotal,
    deliveryFee,
    discount,
    couponApplied: couponApplied || null,
    total,
    deliveryAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
  });

  if (couponApplied) {
    await Coupon.findOneAndUpdate({ code: couponApplied }, { $inc: { usedCount: 1 } });
  }

  res.status(201).json({ success: true, order });
});

exports.getMyOrders = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("cook", "kitchenName city image")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

exports.getOrderDetails = catchAsyncErrors(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("cook", "kitchenName city image");
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized to view this order" });
  }
  res.status(200).json({ success: true, order });
});

exports.updateOrderStatus = catchAsyncErrors(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus },
    { new: true }
  );
  res.status(200).json({ success: true, order });
});

exports.cancelOrder = catchAsyncErrors(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  if (["out_for_delivery", "delivered"].includes(order.orderStatus)) {
    return res.status(400).json({ success: false, message: "Order can no longer be cancelled" });
  }
  order.orderStatus = "cancelled";
  await order.save();
  res.status(200).json({ success: true, order });
});
