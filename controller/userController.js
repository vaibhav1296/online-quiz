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
const validateAdminAPI = require("../service/validateAdminAPI");
const validateUserAPI = require("../service/validateUserAPI");
const { quizConfig } = require("../config/customConfig");
const customConfig = require("../config/customConfig");
const moment = require("moment");

router.post(
  "/create-quiz",
  validateAuthAPI.verifyToken,
  validateUserAPI.validateCreateQuizReq,
  async (req, res, next) => {
    const topicId = req.session.reqBody.topicId;
    const numberOfQuestions = req.session.reqBody.numberOfQuestions;
    const questionsObject = await systemQueryObject.getQuestionsByTopicId(
      topicId
    );
    if (validateChecksObject.isNullOrUndefined(questionsObject)) {
      throw onlineQuizError("Can't craete quiz this time", 400);
    }
    let questionWithTopicArray = questionsObject.map((item) => {
      return {
        id: item.id,
        topicId: item.topicId,
        questionId: item.questionId,
        questionName: JSON.parse(item.question.name),
        submittedChoice: "",
      };
    });
    let slicedArr = questionWithTopicArray.slice(0, numberOfQuestions);
    let selectedQuestionsArray = [];
    slicedArr.forEach((element) => {
      selectedQuestionsArray.push({
        questionId: element.questionId,
        name: JSON.stringify(element.questionName),
      });
    });
    const questionSet = {
      list: selectedQuestionsArray,
    };
    const totalMarks = slicedArr.length * customConfig.marksPerQuestion;
    const obtainedMarks = 0;
    let quiz = {
      userId: req.session.userId,
      topicId: topicId,
      questionSet: JSON.stringify(questionSet),
      totalMarks,
      obtainedMarks,
    };
    const quizObject = await userQueryObject.createQuiz(quiz);
    if (validateChecksObject.isNullOrUndefined(quizObject)) {
      throw onlineQuizError("Something went wrong in quiz creation", 400);
    }
    res.locals.response = {
      message: "The quiz has been created successfully",
      body: {
        topicId: topicId,
        questionSet: questionSet,
        totalMarks,
        obtainedMarks,
        quizId: quizObject.id,
      },
    };
    next();
  }
);

router.post(
  "/submit-quiz",
  validateAuthAPI.verifyToken,
  validateUserAPI.validateSubmitQuizRequest,
  async (req, res, next) => {
    const { topicId, totalMarks, questionSet, quizId } = req.session.reqBody;
    let countRightAnswers = 0;
    questionSet.forEach((questionObject) => {
      if (questionObject.question.answer == questionObject.submittedChoice) {
        countRightAnswers++;
      }
    });
    const obtainedMarks = countRightAnswers * customConfig.marksPerQuestion;
    const detailsObject = {
      quizId,
      obtainedMarks,
    };
    const updatedQuiz = await userQueryObject.updateQuizWithSubmittedDetails(
      detailsObject
    );
    if (validateChecksObject.isNullOrUndefined(updatedQuiz)) {
      throw onlineQuizError("Something went wrong with submission", 400);
    }
    const archive = {
      userId: req.session.userId,
      quizId,
    };
    const archivedQuizObject = await userQueryObject.creaeArchivedQuiz(archive);
    if (validateChecksObject.isNullOrUndefined(archivedQuizObject)) {
      throw onlineQuizError("Error while archiving the quiz", 400);
    }
    res.locals.response = {
      message: "Your submition was successfull",
      body: {
        totalMarks,
        obtainedMarks,
        topicId,
      },
    };
    next();
  }
);

router.get(
  "/profile/:id",
  validateAuthAPI.verifyToken,
  async (req, res, next) => {
    try {
      if (validateChecksObject.isNullOrUndefined(req.query.page)) {
        throw onlineQuizError("Please provide page number", 400);
      }
      if (validateChecksObject.isNullOrUndefined(req.params.id)) {
        throw onlineQuizError("The user ID hasn't been provided", 400);
      }
      let page = Number(req.query.page);
      let limit = 5;
      let offset = limit * (page - 1);
      const userId = req.params.id;
      const countOfQuiz = await userQueryObject.getAllArchivedQuizCount(userId);
      const pageCount = Math.ceil(countOfQuiz / limit);
      let profileData = await userQueryObject.getAllArchivedQuizDetails(
        userId,
        offset,
        limit
      );
      profileData = profileData.map((obj) => {
        return {
          quizId: obj.quizId,
          topicName: obj.quiz.topic.name,
          obtainedMarks: obj.quiz.obtainedMarks,
          totalMarks: obj.quiz.totalMarks,
          createdAt: moment(obj.quiz.createdAt).calendar(),
        };
      });
      for (let i = 0; i < profileData.length; i++) {
        const quiz = await userQueryObject.getQuizById(profileData[i].quizId);
        let level;
        for (const property in quizConfig) {
          if (
            quizConfig[property] === JSON.parse(quiz.questionSet).list.length
          ) {
            switch (property) {
              case "easyMode":
                level = "Easy";
                break;
              case "mediumMode":
                level = "Medium";
                break;
              default:
                level = "Hard";
            }
          }
        }
        profileData[i].level = level;
      }
      res.locals.response = {
        message: "All the quizs of user",
        body: {
          pageCount,
          profileData,
        },
      };
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
