
require('dotenv').config();
const express = require('express')
const app = express();
const validateChecksObject = require('./validateChecks');
const onlineQuizError = require('../config/onlineQuizError').onlineQuizError
const systemQueryObject = require('./queryObject/systemQueryObject')
const redisService = require('./redisService');
const jwt = require('jsonwebtoken');
const userQueryObject = require('./queryObject/userQueryObject');
let authAPIValidator = {};
authAPIValidator.validateRegisterRequest = (req, res, next)=>{
    const email= req.body.email;
    const name= req.body.name;
    const password=req.body.password;
    const gender= req.body.gender;
    const role= req.body.role;
    if(validateChecksObject.isNullOrUndefined(email) || !validateChecksObject.isEmailValid(email)){
        // res.status(400).json({message:"The email is invalid"});
        throw onlineQuizError("The email is invalid",400)
    }else if(validateChecksObject.isNullOrUndefined(name) || !validateChecksObject.isNameValid(name)){
        // res.status(400).json({message:"The name is invalid"});
        throw onlineQuizError("The name is invalid",400)
    }else if(validateChecksObject.isNullOrUndefined(password) || !validateChecksObject.isPasswordValid(password)){
        // res.status(400).json({message:"The password is invalid"});
        throw onlineQuizError("The password is invalid",400)
    }else if(validateChecksObject.isNullOrUndefined(gender) || !validateChecksObject.isString(gender)){
        // res.status(400).json({message:"The gender is invalid"});
        throw onlineQuizError("The gender is invalid",400)
    }else if(validateChecksObject.isNullOrUndefined(role) || !validateChecksObject.isString(role)){
        // res.status(400).json({message:"The role is invalid"});
        throw onlineQuizError("The role is invalid",400)
    }
    authAPIValidator.checkEmailDomainAndRole(email, role.toUpperCase())
    .then(userRoleObject=>{
        req.session.validatedReqBody = {
            email: email.trim(),
            name: name.trim(),
            password:password.trim(),
            gender: gender.trim(),
            userRoleId: userRoleObject.id
        }
        // res.locals.validatedReqBody = {
        //     email: email.trim(),
        //     name: name.trim(),
        //     password:password.trim(),
        //     gender: gender.trim(),
        //     userRoleId: userRoleObject.id
        // }
        next();
    })
    .catch(err=>{
        console.log('SYSTEM QUERY ABOUT ROLE BY EMAIL DOMAIN', err)
        // res.status(400).json({message:err.message})
        next(err)
    })
}
authAPIValidator.validateLogInRequest = (req, res, next)=>{
    const email= req.body.email;
    const password=req.body.password;
    const role= req.body.role;
    if(validateChecksObject.isNullOrUndefined(email) || !validateChecksObject.isEmailValid(email)){
        // res.status(400).json({message:"The email is invalid"});
        throw onlineQuizError("The email is invalid",400)
    }else if(validateChecksObject.isNullOrUndefined(password) || !validateChecksObject.isPasswordValid(password)){
        // res.status(400).json({message:"The password is invalid"});
        throw onlineQuizError("The password is invalid",400)
    }else if(validateChecksObject.isNullOrUndefined(role) || !validateChecksObject.isString(role)){
        // res.status(400).json({message:"The role is invalid"});
        throw onlineQuizError("The role is invalid",400)
    }
    authAPIValidator.checkEmailDomainAndRole(email, role.toUpperCase())
    .then(userRoleObject=>{
        req.session.validatedReqBody = {
            email: email.trim(),
            password:password.trim(),
            userRoleId: userRoleObject.id
        }
        // res.locals.validatedReqBody = {
        //     email: email.trim(),
        //     password:password.trim(),
        //     userRoleId: userRoleObject.id
        // }
        next();
    })
    .catch(err=>{
        console.log('SYSTEM QUERY ABOUT ROLE BY EMAIL DOMAIN', err)
        // res.status(400).json({message:err.message})
        next(err)
    })
}
authAPIValidator.checkEmailDomainAndRole = (email, role) => {
    return new Promise((resolve, reject)=>{
        const emailDomain = email.split("@")[1]
        systemQueryObject.getRoleByEmailDomain(emailDomain)
        .then(userRoleObject=>{
            const roleName = userRoleObject.name
            if(roleName === role){
                resolve(userRoleObject)
            }else{
                // res.status(400).json({message:"This email is not valid for provided role"})
                // throw onlineQuizError("The email is invalid",400)
                return reject(onlineQuizError("This email is not valid for provided role",400))
            }
        })
        .catch(err=>{
            console.log('checkEmailDomainAndRole PROMISE ERROR', err)
            reject(err)
        })
    })
}
authAPIValidator.verifyToken = async (req, res, next)=>{
    const bearerToken = req.headers['authorization'];
    if(!bearerToken){
        // res.status(400).json({message:"Please provide authorization header token"});
        throw onlineQuizError("Please provide authorization header token", 400)
    }
    const token = bearerToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            console.log('JWT VERIFY TOKEN ERROR', err);
            // res.status(400).json({message:err.message});
            throw onlineQuizError(err.message, 400)
        }
        const userId = decoded.userId;
        redisService.getValue(userId)
        .then(replyFromRedis=>{
            if(replyFromRedis === token){
                console.log('TOKEN VERIFIED')
                next();
            }else{
                // res.status(400).json({message:"The token does match"});
                throw onlineQuizError("The token does match", 400)
            }
        })
        .catch(err=>{
            console.log('REDIS GET VALUE ERROR', err)
            // res.status(400).json({message:"You are not authorized"})
            next(err)
        })
        
    })
}
authAPIValidator.adminAuth = async (req, res, next)=>{
    // console.log('USER OBJECT', res.locals)
    // console.log('APP LOCALS', app.locals)
    const userRoleId = req.session.user.userRoleId
    const userRoleObject = await systemQueryObject.getRoleByRoleId(userRoleId)
    if(validateChecksObject.isNullOrUndefined(userRoleObject)){
        // res.status(400).json({message:"Invalid Role ID"})
        throw onlineQuizError("Invalid Role ID", 400)
    }
    if(userRoleObject.name === 'ADMIN'){
        next();
    }else{
        // res.status(400).json({message:"You are not registered as admin"})
        throw onlineQuizError("You are not registered as admin", 400)
    }
}
module.exports = authAPIValidator;