const express = require('express');
const router = express.Router();
const userQueryObject = require('../service/queryObject/userQueryObject');
const onlineQuizError = require('../config/onlineQuizError').onlineQuizError
const systemQueryObject = require('../service/queryObject/systemQueryObject');
const validateAuthAPI = require('../service/validateAuthAPI');
const validateAdminAPI = require('../service/validateAdminAPI')
const validateChecksObject = require('../service/validateChecks');

router.post('/add-topic', validateAuthAPI.verifyToken,
    validateAuthAPI.adminAuth,
    validateAdminAPI.validateAddTopicRequest,
    async (req, res, next)=>{
        const reply = systemQueryObject.addNewTopic(req.session.topicName.toUpperCase());
        if(!reply){
            // res.status(400).json({message:"The topic is not added"})
            throw onlineQuizError("The topic is not added",400)
        }
        // res.status(200).json({message:"The topic name is added", topicName:req.session.topicName});
        res.locals.response = {
            body:{
                topic_name:req.session.topicName
            },
            message:"The topic name is added"
        }
        next()
})
router.post('/add-question',validateAuthAPI.verifyToken,
    validateAuthAPI.adminAuth,
    validateAdminAPI.validateAddQuestionRequest,
    async (req, res, next)=>{
        const reqBody = req.session.addQuestionBody
        console.log('REQ BODY', reqBody)
        const topicObject = await systemQueryObject.getTopicByName(reqBody.topicName)
        if(validateChecksObject.isNullOrUndefined(topicObject)){
            throw onlineQuizError("Invalid topic name", 400)
        }
        const topicId = topicObject.id
        const question = JSON.stringify(reqBody.question)
        console.log('QUESTION BEFORE INSERT', question)
        const questionObeject = await systemQueryObject.addNewQuestion(question)
        if(validateChecksObject.isNullOrUndefined(questionObeject)){
            throw onlineQuizError("Error while adding new question to DB", 400)
        }
        const questionId = questionObeject.id
        const topic2QuestionObject = await systemQueryObject.addTopic2Question(topicId, questionId)
        if(validateChecksObject.isNullOrUndefined(topic2QuestionObject)){
            throw onlineQuizError("Error while adding new question to DB", 400)
        }
        res.locals.response = {
            body:{
                topic_name:topicObject.name,
                added_question:JSON.parse(questionObeject.name)
            },
            message:"The topic name is added"
        }
        next()

})
module.exports = router;