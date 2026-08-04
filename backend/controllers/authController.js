const crypto = require("crypto");
const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/sendToken");

exports.register = catchAsyncErrors(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await User.create({ name, email, password, phone });
  sendToken(user, 201, res);
});

exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter email and password" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out" });
});

exports.getProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

exports.updateProfile = catchAsyncErrors(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, address },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, user });
});

exports.forgotPassword = catchAsyncErrors(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ success: false, message: "No account found with this email" });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // TODO: send this via email (Nodemailer) later.
  // For now, returned directly so you can test the flow without email setup.
  res.status(200).json({
    success: true,
    message: "Password reset link generated",
    resetUrl, // ⚠️ remove this from the response once real email sending is added
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
  }

  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});