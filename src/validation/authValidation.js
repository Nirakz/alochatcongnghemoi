import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let register = [
  check("email", transValidation.email_incorrect)
    .isEmail()
    .trim(),
  check("gender", transValidation.gender_incorrect)
    .isIn(["male", "female"]),
  check("password", transValidation.password_incorrect)
    .isLength({min: 8})
    .matches(),
  check("password_confirmation", transValidation.password_confirmation_incorrect)
    .custom((value, {req}) => value === req.body.password)
];

let admin = [
  check("email")
    .isEmail()
    .trim(),
  check("gender")
    .isIn(["male", "female"]),
  check("password")
    .isLength({min: 8})
    .matches(),
  check("password_confirmation")
    .custom((value, {req}) => value === req.body.password)
];

module.exports = {
  register: register,
  admin: admin
}
