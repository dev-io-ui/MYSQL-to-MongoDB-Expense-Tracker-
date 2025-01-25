const express = require("express");
const purchaseMembershipController = require("../controllers/purchaseMembership");
const authenticatemiddleware = require("../middleware/auth");
const router = express.Router();

router.get(
  "/premiumMembership",
  authenticatemiddleware.authenticate,
  purchaseMembershipController.purchasePremium
);
router.post(
  "/updateTransactionStatus",
  authenticatemiddleware.authenticate,
  purchaseMembershipController.updateTransactionStatus
);
module.exports = router;