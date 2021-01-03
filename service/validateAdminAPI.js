require("dotenv").config();
const validateChecksObject = require("./validateChecks");
const systemQueryObject = require("./queryObject/systemQueryObject");
const onlineQuizError = require("../config/onlineQuizError").onlineQuizError;
const redisService = require("./redisService");
const jwt = require("jsonwebtoken");
const userQueryObject = require("./queryObject/userQueryObject");

validateAdminAPI = {};
validateAdminAPI.validateAddTopicRequest = (req, res, next) => {
  const topicName = req.body.topic_name;
  if (
    validateChecksObject.isNullOrUndefined(topicName) ||
    !validateChecksObject.isString(topicName)
  ) {
    // res.status(400).json({message:"The topic name is invalid"})
    throw onlineQuizError("The topic name is invalid", 400);
  }
  req.session.topicName = topicName;
  next();
};
validateAdminAPI.validateAddQuestionRequest = (req, res, next) => {
  const topicName = req.body.topic_name;
  if (
    validateChecksObject.isNullOrUndefined(topicName) ||
    !validateChecksObject.isString(topicName)
  ) {
    // res.status(400).json({message:"Invalid topic name"})
    throw onlineQuizError("Invalid topic name", 400);
  } else if (validateChecksObject.isNullOrUndefined(req.body.question)) {
    // res.status(400).json({message:"The question object is empty"})
    throw onlineQuizError("The question object is empty", 400);
  }
  const question = req.body.question;
  if (!question.hasOwnProperty("title")) {
    throw onlineQuizError("The question doest not contain title", 400);
  } else if (!question.hasOwnProperty("options")) {
    throw onlineQuizError("The question doest not contain options", 400);
  } else if (!question.hasOwnProperty("answer")) {
    throw onlineQuizError("The question doest not contain answer", 400);
  } else if (
    validateChecksObject.isNullOrUndefined(question.title) ||
    !validateChecksObject.isString(question.title)
  ) {
    throw onlineQuizError("The title is empty/invalid", 400);
  } else if (
    validateChecksObject.isNullOrUndefined(question.answer) ||
    !validateChecksObject.isString(question.answer)
  ) {
    throw onlineQuizError("The answer is empty/invalid", 400);
  } else if (validateChecksObject.isNullOrUndefined(question.options)) {
    throw onlineQuizError("The title is empty/invalid", 400);
  }
  req.session.addQuestionBody = {
    topicName: topicName.toUpperCase(),
    question,
  };
  next();
};
module.exports = validateAdminAPI;
