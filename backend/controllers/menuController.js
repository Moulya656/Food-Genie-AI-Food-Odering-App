const MenuItem = require("../models/MenuItem");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.getMenuForCook = catchAsyncErrors(async (req, res) => {
  const items = await MenuItem.find({ cook: req.params.cookId, available: true });
  res.status(200).json({ success: true, count: items.length, items });
});

exports.getMenuItem = catchAsyncErrors(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("cook", "kitchenName city");
  if (!item) return res.status(404).json({ success: false, message: "Dish not found" });
  res.status(200).json({ success: true, item });
});

exports.searchMenuItems = catchAsyncErrors(async (req, res) => {
  const { keyword = "", category, dietType } = req.query;
  const filter = { available: true };
  if (keyword) filter.name = { $regex: keyword, $options: "i" };
  if (category) filter.category = category;
  if (dietType) filter.dietType = dietType;

  const items = await MenuItem.find(filter).populate("cook", "kitchenName city rating");
  res.status(200).json({ success: true, count: items.length, items });
});

exports.createMenuItem = catchAsyncErrors(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, item });
});

exports.updateMenuItem = catchAsyncErrors(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, item });
});

exports.deleteMenuItem = catchAsyncErrors(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Dish removed" });
});
