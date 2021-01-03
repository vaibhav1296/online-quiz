require("dotenv").config();
const express = require("express");
const app = express();
const validateChecksObject = require("./validateChecks");
const onlineQuizError = require("../config/onlineQuizError").onlineQuizError;
const systemQueryObject = require("./queryObject/systemQueryObject");
const redisService = require("./redisService");
const jwt = require("jsonwebtoken");
const userQueryObject = require("./queryObject/userQueryObject");
const { quizConfig } = require("../config/customConfig");

validateUserAPI = {};

validateUserAPI.validateCreateQuizReq = (req, res, next) => {
  try {
    if (validateChecksObject.isNullOrUndefined(req.body.topic_id)) {
      next(onlineQuizError("TopicId is invalid/empty", 400));
    } else if (
      validateChecksObject.isNullOrUndefined(req.body.level) ||
      !validateChecksObject.isString(req.body.level)
    ) {
      next(onlineQuizError("Level is invalid/empty", 400));
    }
    const topicId = req.body.topic_id;
    const level = req.body.level.toUpperCase();
    let numberOfQuestions;
    switch (level) {
      case "EASY":
        numberOfQuestions = quizConfig.easyMode;
        break;
      case "MEDIUM":
        numberOfQuestions = quizConfig.mediumMode;
        break;
      case "HARD":
        numberOfQuestions = quizConfig.hardMode;
        break;
      default:
        numberOfQuestions = 10;
        break;
    }
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, reply) => {
      if (err) {
        next(onlineQuizError("JWT token error", 400));
      }
      req.session.userId = reply.userId;
    });
    req.session.reqBody = {
      topicId,
      numberOfQuestions,
    };
    next();
  } catch (err) {
    next(err);
  }
};

validateUserAPI.validateSubmitQuizRequest = (req, res, next) => {
  try {
    if (validateChecksObject.isNullOrUndefined(req.body.topic_id)) {
      next(onlineQuizError("The topic Id is empty/invalid", 400));
    } else if (validateChecksObject.isNullOrUndefined(req.body.total_marks)) {
      next(onlineQuizError("The total marks is empty/invalid", 400));
    } else if (validateChecksObject.isNullOrUndefined(req.body.questionSet)) {
      next(onlineQuizError("The question set is empty/invalid", 400));
    } else if (validateChecksObject.isNullOrUndefined(req.body.quizId)) {
      next(onlineQuizError("The quiz ID is empty/invalid", 400));
    }
    const questionSetArr = req.body.questionSet;
    const parsedQuestionSetArr = [];
    questionSetArr.forEach((element) => {
      if (
        !element.hasOwnProperty("question") ||
        !element.hasOwnProperty("submittedChoice")
      ) {
        next(onlineQuizError("Invalid question set object", 400));
      }
    });
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, reply) => {
      if (err) {
        next(onlineQuizError("JWT token error", 400));
      }
      req.session.userId = reply.userId;
    });
    req.session.reqBody = {
      topicId: req.body.topic_id,
      totalMarks: req.body.total_marks,
      questionSet: req.body.questionSet,
      quizId: req.body.quizId,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validateUserAPI;
