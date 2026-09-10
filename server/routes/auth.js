const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware.js");
const {
  createAccount,
  login,
  logout,
  forgotPassword,
  forgotUsername,
  verifyResetToken,
  resetPassword,
  getCurrentUser,
} = require("../controllers/auth.js");

router.route("/create-account").post(createAccount);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/forgot-password").post(forgotPassword);

router.route("/forgot-username").post(forgotUsername);
router.route("/me").get(authenticateUser, getCurrentUser);
router.route("/verify-reset-token/:token").get(verifyResetToken);

router.route("/reset-password/:token").patch(resetPassword);

module.exports = router;
