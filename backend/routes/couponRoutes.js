const express = require("express");
const { validateCoupon, createCoupon, getCoupons } = require("../controllers/couponController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/validate", validateCoupon);
router.get("/", isAuthenticated, authorizeRoles("admin"), getCoupons);
router.post("/", isAuthenticated, authorizeRoles("admin"), createCoupon);

module.exports = router;
