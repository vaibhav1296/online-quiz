const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const onlineQuizError = require("../config/onlineQuizError").onlineQuizError;
const userQueryObject = require("../service/queryObject/userQueryObject");
const systemQueryObject = require("../service/queryObject/systemQueryObject");
const validateAuthAPI = require("../service/validateAuthAPI");
const validateChecksObject = require("../service/validateChecks");
const redisService = require("../service/redisService");
const validateAdminAPI = require("../service/validateAdminAPI");
const validateUserAPI = require("../service/validateUserAPI");

router.get("/topics", validateAuthAPI.verifyToken, (req, res, next) => {
  systemQueryObject
    .getAllTopics()
    .then((topicList) => {
      let topics = topicList.map((topic) => {
        return {
          topicId: topic.id,
          name: topic.name,
          topicDescription: topic.dataValues.topic_description,
          topicTestDetail: topic.dataValues.topic_test_detail,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        };
      });
      res.locals.response = {
        message: "List of topics",
        body: {
          topics: topics,
        },
      };
      next();
    })
    .catch((err) => {
      throw onlineQuizError(err.message, 400);
    });
});

module.exports = router;
