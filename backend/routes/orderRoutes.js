const express = require("express");
const {
  createOrder, getMyOrders, getOrderDetails, updateOrderStatus, cancelOrder,
} = require("../controllers/orderController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderDetails);
router.put("/:id/status", isAuthenticated, authorizeRoles("admin", "cook"), updateOrderStatus);
router.put("/:id/cancel", isAuthenticated, cancelOrder);

module.exports = router;
