const { check, validationResult } = require("express-validator");

exports.validateEventInput = [
  check("eventName")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("event name is required"),
  check("time").notEmpty().withMessage("Date is required").isDate(),
  check("description").notEmpty().withMessage("Description required"),
];

exports.validateInviteInput = [
  check("email").isEmail().withMessage("Please type correct email"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  } else {
    next();
  }
};
