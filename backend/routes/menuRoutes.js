const express = require("express");
const {
  getMenuForCook, getMenuItem, searchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
} = require("../controllers/menuController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.get("/search", searchMenuItems);
router.get("/cook/:cookId", getMenuForCook);
router.get("/:id", getMenuItem);
router.post("/", isAuthenticated, authorizeRoles("admin", "cook"), createMenuItem);
router.put("/:id", isAuthenticated, authorizeRoles("admin", "cook"), updateMenuItem);
router.delete("/:id", isAuthenticated, authorizeRoles("admin", "cook"), deleteMenuItem);

module.exports = router;
