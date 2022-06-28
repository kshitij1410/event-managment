const express = require("express");
const router = express.Router();
const User = require("../models/user");

const {
  register,
  login,
  logout,
  updatepassword,
  resetpassword,
  changepassword,
} = require("../controller/user");

const {
  validateLoginRequest,
  validateRegisterRequest,
  isRequestValidated,
  validateUpdatePasswordInput,
  validateResetPasswordInput,
  validateChangePasswordInput,
} = require("../validator/userValidator");

const { verifyUser } = require("../middleware/verifyUser");

router.post("/login", validateLoginRequest, isRequestValidated, login);
router.post("/register", validateRegisterRequest, isRequestValidated, register);
router.post("/logout", verifyUser, logout);

router.put(
  "/updatepassword",
  verifyUser,
  validateUpdatePasswordInput,
  isRequestValidated,
  updatepassword
);

router.post(
  "/resetpassword",
  validateResetPasswordInput,
  isRequestValidated,
  resetpassword
);
router.put(
  "/changepassword/:token",
  validateChangePasswordInput,
  changepassword
);

module.exports = router;
