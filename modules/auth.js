const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const nameRegexp = /[A-Za-z]/;

const userSchema = Schema(
  {
    name: {
      type: String,
      match: nameRegexp,
      default: "",
    },
    lastName: {
      type: String,
      match: nameRegexp,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 6,
    },
    email: {
      type: String,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    token: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const registerJoiSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp),
  lastName: Joi.string().pattern(nameRegexp),
  username: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
const loginJoiSchema = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  schemas: {
    regJoi: registerJoiSchema,
    logJoi: loginJoiSchema,
  },
};
