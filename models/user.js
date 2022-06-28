const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 30,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hash_password: {
      type: String,
      required: true,
      trim: true,
    },
    userEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    resetPasswordToken: {
      type: String,
      default: "",   // for api call
    },
    resetPasswordExpires: {
      type: String,
      default: "",   // for api call
    }
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  }
};

module.exports = mongoose.model("User", userSchema);
