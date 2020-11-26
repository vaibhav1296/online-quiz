const emailValidator = require('email-validator');
const OnlineQuizError = require('../config/onlineQuizError').OnlineQuizError
let validateChecks = {};

validateChecks.isString = (data)=>{
    return typeof data === "string" && data.trim().length > 0;
}
validateChecks.isNullOrUndefined = (data)=>{
    if(data === null || data === undefined){
        return true;
    }
    return false;
}
validateChecks.isEmailValid = (email)=>{
    if(emailValidator.validate(email)){
        return true;
    }
    return false;
}
validateChecks.isPasswordValid = (data)=>{
    const patt = /^[A-Za-z]\w{7,14}$/;
    if(data.match(patt) && validateChecks.isString(data)){
        return true;
    }
    return false;
}
validateChecks.isNameValid = (data)=>{
    if(validateChecks.isString(data) && data.length < 21){
        return true;
    }
    return false;
}

validateChecks.isOnlineQuizError = err =>{
    return err instanceof OnlineQuizError
}

module.exports = validateChecks