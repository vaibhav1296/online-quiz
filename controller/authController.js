const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const onlineQuizError = require("../config/onlineQuizError").onlineQuizError;
const userQueryObject = require("../service/queryObject/userQueryObject");
const systemQueryObject = require("../service/queryObject/systemQueryObject");
const validateAuthAPI = require("../service/validateAuthAPI");
const validateChecksObject = require("../service/validateChecks");
const redisService = require("../service/redisService");

router.post(
  "/register",
  validateAuthAPI.validateRegisterRequest,
  async (req, res, next) => {
    const email = req.session.validatedReqBody.email;
    const name = req.session.validatedReqBody.name;
    const password = req.session.validatedReqBody.password;
    const gender = req.session.validatedReqBody.gender.toUpperCase();
    const userRoleId = req.session.validatedReqBody.userRoleId;
    try {
      const user = await userQueryObject.findUserByEmail(email);
      if (!user) {
        const genderObject = await systemQueryObject.getGenderId(gender);
        const genderId = genderObject.id;
        const hashedPassword = bcrypt.hashSync(password, 6);
        const userObject = {
          email,
          name,
          genderId,
          hashedPassword,
        };
        const newUser = await userQueryObject.createNewUser(userObject);
        const userId = newUser.id;
        const user2UserRoleObject = await userQueryObject.createUser2UserRole(
          userId,
          userRoleId
        );
        if (validateChecksObject.isNullOrUndefined(user2UserRoleObject)) {
          // res.status(400).json({message:"Error creating user 2 user role"})
          throw onlineQuizError("Error creating user 2 user role", 400);
        }
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });
        if (validateChecksObject.isNullOrUndefined(token)) {
          // res.status(400).json({message:"JWT token generation error"})
          throw onlineQuizError("JWT token generation error", 400);
        }
        const replyFromRedis = await redisService.setValue(userId, token);
        if (replyFromRedis) {
          req.session.user = {
            userId: userId,
            email: userObject.email,
            name: userObject.name,
            gender,
            userRoleId: userRoleId,
          };
          res.locals.response = {
            body: {
              user: req.session.user,
              token,
            },
            message: "The user is registered successfully",
          };
          next();
          // res.status(200).json({message:"The user is registered successfully", token:token, user:res.locals.user})
        } else {
          // res.status(400).json({message:"Redis set value err"});
          throw onlineQuizError("Redis set value err", 400);
        }
      } else {
        // res.status(400).json({message:"A user already registered with given credential"});
        throw onlineQuizError(
          "A user already registered with given credential",
          400
        );
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  validateAuthAPI.validateLogInRequest,
  async (req, res, next) => {
    const email = req.session.validatedReqBody.email;
    const password = req.session.validatedReqBody.password;
    const userRoleId = req.session.validatedReqBody.userRoleId;
    try {
      const user = await userQueryObject.findUserByEmail(email);
      if (validateChecksObject.isNullOrUndefined(user)) {
        // res.status(400).json({message:"No user with this email"})
        throw onlineQuizError("No user with this email", 400);
      } else {
        const userId = user.id;
        const userRoleIdObject = await userQueryObject.getUserRoleIdByUserId(
          userId
        );
        if (validateChecksObject.isNullOrUndefined(userRoleIdObject)) {
          // res.status(400).json({message:"No user role found with this registered email"});
          throw onlineQuizError(
            "No user role found with this registered email",
            400
          );
        }
        const isPasswordValid = bcrypt.compareSync(
          password,
          user.hashedPassword
        );
        if (validateChecksObject.isNullOrUndefined(isPasswordValid)) {
          // res.status(400).json({message:"The password does not match"});
          throw onlineQuizError("The password does not match", 400);
        }
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });
        if (validateChecksObject.isNullOrUndefined(token)) {
          // res.status(400).json({message:"JWT token sign error"});
          throw onlineQuizError("JWT token sign error", 400);
        }
        const genderObject = await systemQueryObject.getGenderName(
          user.genderId
        );
        const genderName = genderObject.type;
        const replyFromRedis = await redisService.setValue(userId, token);
        if (replyFromRedis) {
          req.session.user = {
            userId: user.id,
            email: user.email,
            name: user.name,
            gender: genderName,
            userRoleId: userRoleId,
          };
          res.locals.response = {
            body: {
              user: req.session.user,
              token,
            },
            message: "The user has been logged in successfully",
          };
          // res.status(200).json({message:"The user has been logged in successfully", token:token, user:res.locals.user});
          next();
        } else {
          // res.status(400).json({message:"Redis set value error"});
          throw onlineQuizError("Redis set value error", 400);
        }
      }
    } catch (err) {
      // res.status(400).json({message:err.message});
      throw onlineQuizError(err.message, 400);
    }
  }
);
router.delete("/logout", (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    // res.status(400).json({message:"Please provide authorization header token"});
    throw onlineQuizError("Please provide authorization header token", 400);
  }
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // res.status(400).json({message:err.message});
      throw onlineQuizError(err.message, 400);
    }
    const userId = decoded.userId;
    redisService
      .deleteValue(userId)
      .then((replyFromRedis) => {
        if (replyFromRedis) {
          // res.status(200).json({message:"The user has been logged out successfully"});
          res.locals.response = {
            message: "The user has been logged out successfully",
          };
          next();
        }
      })
      .catch((err) => {
        // res.status(400).json({message:err.message});
        throw onlineQuizError(err.message, 400);
      });
  });
});
router.get("/check", validateAuthAPI.verifyToken, async (req, res, next) => {
  // res.status(200).json({message:"You have access to this route", data:res.locals.user})
  res.locals.response = {
    message: "You have access to this route",
  };
});
module.exports = router;
