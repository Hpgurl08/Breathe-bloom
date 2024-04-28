const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");

exports.getRegisterPage = async (req, res) => {
  const info = {
    title: "Register",
    description: "Registerpage content",
    token: "",
  };
  res.render("register", info);
};

exports.getLoginPage = async (req, res) => {
  const info = {
    title: "Login",
    description: "Loginpage content",
    token: "",
  };
  res.render("login", info);
};

exports.registerNewUser = async (req, res) => {
  console.log(req.body);
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // Redirect with error message if user already exists
      return res.redirect("/register?error=email_exists");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user object with the provided details
    const newUser = new User({
      email: req.body.email,
      fullName: req.body.fullname,
      password: hashedPassword,
      username: req.body.email,
      hash: hashedPassword,
      salt: salt,
      // Add the security question and answer to the user object
      securityQuestion: req.body.securityQuestion,
      securityAnswer: req.body.securityAnswer,
    });

    // Save the new user to the database
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.log(error);
    // Redirect with error message if registration fails
    return res.redirect("/register?error=register_failure");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).redirect("/login?error=invalid_credentials");
    const isValidPassword = await bcrypt.compare(password, user.hash);
    if (!isValidPassword)
      return res.status(400).redirect("/login?error=invalid_credentials");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    localStorage.setItem("AUTH_TOKEN", token);
    req.session.token = token;
    return res.redirect("/");
  } catch (error) {
    res.status(500).send("/login?error=login_error");
  }
};

exports.logoutUser = async (req, res) => {
  delete req.session.token;
  localStorage.removeItem("AUTH_TOKEN");
  return res.redirect("/login");
};

exports.getForgotPasswordPage = async (req, res) => {
  const info = {
    title: "Forgot Password",
    description: "Forgot Password Page",
    token: "",
  };
  res.render("forgot-password", info);
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // User not found with the provided email
      return res.redirect("/forgot-password?error=user_not_found");
    }
    // Check if the provided security answer matches the user's security answer
    if (user.securityAnswer !== securityAnswer) {
      // Security answer is incorrect
      return res.redirect("/forgot-password?error=invalid_security_answer");
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's hash field with the new hashed password
    user.hash = hashedPassword;
    await user.save();
    // Redirect to login page with success message
    return res.redirect(
      `/login?message=Password_reset_successfully._Please_login_with_your_new_password`
    );
  } catch (error) {
    console.error(error);
    // Error occurred while resetting password
    return res.redirect("/forgot-password?error=reset_password_error");
  }
};
