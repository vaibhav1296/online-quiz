
require('dotenv').config();
const express = require('express')
const app = express();
const validateChecksObject = require('./validateChecks');
const onlineQuizError = require('../config/onlineQuizError').onlineQuizError
const systemQueryObject = require('./queryObject/systemQueryObject')
const redisService = require('./redisService');
const jwt = require('jsonwebtoken');
const userQueryObject = require('./queryObject/userQueryObject');
const {quizConfig} = require('../config/customConfig')

validateUserAPI = {}

validateUserAPI.validateCreateQuizReq = (req, res, next)=>{
    if(validateChecksObject.isNullOrUndefined(req.body.topic_id)){
        throw onlineQuizError("TopicId is invalid/empty", 400)
    }else if(validateChecksObject.isNullOrUndefined(req.body.level) || !validateChecksObject.isString(req.body.level)){
        throw onlineQuizError("Level is invalid/empty", 400)
    }
    const topicId = req.body.topic_id;
    const level = req.body.level.toUpperCase();
    let numberOfQuestions
    switch(level){
        case 'EASY':
            numberOfQuestions=quizConfig.easyMode
            break;
        case 'MEDIUM':
            numberOfQuestions = quizConfig.mediumMode
            break;
        case 'HARD':
            numberOfQuestions = quizConfig.hardMode
            break;
        default:
            numberOfQuestions = 10
            break;
    }
    req.session.reqBody = {
        topicId,
        numberOfQuestions
    }
    next();
}

validateUserAPI.validateSubmitQuizRequest = (req, res, next)=>{
    try{
        if(validateChecksObject.isNullOrUndefined(req.body.topic_id)){
            throw onlineQuizError("The topic Id is empty/invalid", 400)
        }else if (validateChecksObject.isNullOrUndefined(req.body.total_marks)){
            throw onlineQuizError("The total marks is empty/invalid", 400)
        }else if(validateChecksObject.isNullOrUndefined(req.body.questionSet)){
            throw onlineQuizError("The question set is empty/invalid", 400)
        }else if(validateChecksObject.isNullOrUndefined(req.body.quizId)){
            throw onlineQuizError("The quiz ID is empty/invalid", 400)
        }
        const questionSetArr = req.body.questionSet;
        const parsedQuestionSetArr = []
        questionSetArr.forEach((element)=>{
            if(!element.hasOwnProperty('question') || !element.hasOwnProperty('submittedChoice')){
                throw onlineQuizError("Invalid question set object", 400)
            }
        })
        req.session.reqBody = {
            topicId:req.body.topic_id.trim(),
            totalMarks:req.body.total_marks.trim(),
            questionSet:req.body.questionSet,
            quizId:req.body.quizId.trim()
        }
        next();
    }catch(err){
        console.log('ERROR',err)
    }
}



module.exports = validateUserAPI