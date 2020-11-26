class OnlineQuizError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode || 500
    }
}

const onlineQuizError = (message, statusCode)=>{
    return new OnlineQuizError(message, statusCode)
}
module.exports = {
    OnlineQuizError,
    onlineQuizError
}