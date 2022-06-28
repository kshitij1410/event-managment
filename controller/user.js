const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { mailSender } = require("../utils/mailSender");
const crypto = require("crypto");

exports.register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (email === "" || firstName === "" || password === "") {
    return res.status(400).json("data not entered properly");
  }

  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).json({
        message: "Email alerady register!",
      });
    } else {
      const { firstName, lastName, email, password } = req.body;

      const hash_password = await bcrypt.hash(password, 10);

      // console.log(req.body);
      const _user = new User({
        firstName: firstName,
        lastName,
        email,
        hash_password,
      });

      _user.save((err, data) => {
        if (err) {
          return res.status(400).json({
            message: "something wrong ",
          });
        }
        if (data) {
          return res.status(201).json({
            user: data,
            message: "User register successfully",
          });
        }
      });
    }
  });
};

exports.login = (req, res) => {
  console.log(req.body);

  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (user) {
      if (user.authenticate(req.body.password)) {
        const { firstName, lastName, _id, email, fullName } = user;

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.cookie("token", token, { expiresIn: "1h" });
        res.status(200).json({
          token,
          users: {
            firstName,
            lastName,
            email,
            _id,
            fullName,
          },
        });
      } else {
        res.status(400).json({
          message: "password wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "something is wrong" });
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "signout success...!",
  });
};

exports.updatepassword = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  if (newPassword === " " || oldPassword === " ")
    return res.status(400).json("data not entered properly");
  // console.log("req_id",req._id)
  // console.log("req.decoded",req.decoded)
  // console.log()
  //  const { id } = req.decoded;
  //     if (id)
  //   {
    User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.json({ message: "Something went wrong !" });
    }
    if (user) {
      const match = user.authenticate(oldPassword);
      if (!match) {
        return res.json({ message: "Please enter currect password !" });
      }
      User.findByIdAndUpdate(user._id, {
        hash_password: bcrypt.hash(newPassword, 12),
      });
      return res.json({ message: "Password updated successfully " });
    }
  });
  // } else {
  //   return res.json({ message: "Something went wrong !" });
  // }
};

exports.resetpassword = (req, res) => {
  const { email } = req.body;

  if (email === "") {
    return res.status(400).json("Please enter a email");
  }

  User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      const token = crypto.randomBytes(20).toString("hex");
      await user.updateOne({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 60000,
      });
      await mailSender(email, token, user.username);
      return res.json({
        message: "Reset password link send to on your register mail",
      });
    } else {
      return res.json({ message: "Email is not exist in database" });
    }
  });
};

exports.changepassword = (req, res) => {
  const { newPassword } = req.body;

  if (newPassword === " ")
    return res.status(400).json("Please Enter a password");

  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).exec((err, user) => {
    if (err) {
      return res.status(400).json({ err });
    }

    if (user) {
      user.updateOne({
        hash_password: bcrypt.hash(newPassword, 12),
      });
      return res.json({
        message: "Password reset sucessfully",
      });
    } else {
      return res.json({
        message: "You are not authorize to reset the password",
      });
    }
  });
};
