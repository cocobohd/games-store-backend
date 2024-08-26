const express = require("express");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { User, schemas } = require("../../modules/auth");
const authenticate = require("../../middleware/authenticate");

router.post("/register", async (req, res, next) => {
  try {
    const { error } = schemas.regJoi.validate(req.body);
    if (error) {
      throw new createError(400, error.message);
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      throw new createError(409, "User already exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = {
      ...req.body,
      password: hashPassword,
    };

    await User.create(userData);

    res.status(201).json({
      message: `Welcome, ${req.body.username}`,
      user: username,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = schemas.logJoi.validate(req.body);
    if (error) {
      throw new createError(400, error.message);
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      throw new createError(401, "Cannot find user");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new createError(401, "Username or email wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    await User.findOneAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        username,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res, next) => {
  const userData = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
  };
  res.json({
    user: userData,
  });
});

module.exports = router;
