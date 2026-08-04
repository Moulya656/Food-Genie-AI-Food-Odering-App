const Cook = require("../models/Cook");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.getCooks = catchAsyncErrors(async (req, res) => {
  const resultsPerPage = 12;
  const apiFeatures = new ApiFeatures(Cook.find(), req.query).search().filter();
  const cooksCount = await Cook.countDocuments();
  apiFeatures.pagination(resultsPerPage);
  const cooks = await apiFeatures.query;

  res.status(200).json({ success: true, count: cooks.length, cooksCount, cooks });
});

exports.getCookDetails = catchAsyncErrors(async (req, res) => {
  const cook = await Cook.findById(req.params.id);
  if (!cook) return res.status(404).json({ success: false, message: "Kitchen not found" });
  res.status(200).json({ success: true, cook });
});

exports.createCook = catchAsyncErrors(async (req, res) => {
  const cook = await Cook.create({ ...req.body, owner: req.user.id });
  res.status(201).json({ success: true, cook });
});

exports.updateCook = catchAsyncErrors(async (req, res) => {
  const cook = await Cook.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, cook });
});

exports.deleteCook = catchAsyncErrors(async (req, res) => {
  await Cook.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Kitchen removed" });
});

exports.getCooks = catchAsyncErrors(async (req, res) => {
  const resultsPerPage = 12;
  const apiFeatures = new ApiFeatures(Cook.find(), req.query)
    .search()
    .filter()
    .sort();              // 👈 add this line
  const cooksCount = await Cook.countDocuments();
  apiFeatures.pagination(resultsPerPage);
  const cooks = await apiFeatures.query;

  res.status(200).json({ success: true, count: cooks.length, cooksCount, cooks });
});