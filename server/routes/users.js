const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/login", userController.getLoginPage);

router.get("/register", userController.getRegisterPage);

router.post("/register", userController.registerNewUser);

router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser);

// Route for forgot password page
router.get("/forgot-password", userController.getForgotPasswordPage);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
