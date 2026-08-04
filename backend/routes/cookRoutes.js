const express = require("express");
const {
  getCooks, getCookDetails, createCook, updateCook, deleteCook,
} = require("../controllers/cookController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getCooks);
router.get("/:id", getCookDetails);
router.post("/", isAuthenticated, authorizeRoles("admin", "cook"), createCook);
router.put("/:id", isAuthenticated, authorizeRoles("admin", "cook"), updateCook);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteCook);

module.exports = router;
