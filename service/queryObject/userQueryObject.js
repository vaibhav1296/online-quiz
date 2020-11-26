const models = require('../../models/index');
class userQuery {
    findUserByEmail(email){
        return new Promise((resolve, reject)=>{
            models.user.findOne({
                where:{email}
            })
            .then(user=>{
                resolve(user)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    createNewUser(user){
        return new Promise((resolve, reject)=>{
            models.user.create({
                email:user.email,
                name:user.name,
                hashedPassword: user.hashedPassword,
                genderId: user.genderId
            })
            .then(user=>{
                resolve(user)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    createUser2UserRole(userId, userRoleId){
        return new Promise((resolve, reject)=>{
            models.user2user_role.create({
                userId,
                userRoleId
            })
            .then(user2UserRole=>{
                resolve(user2UserRole)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    getUserRoleIdByUserId(userId){
        return new Promise((resolve, reject)=>{
            models.user2user_role.findOne({
                where:{userId}
            })
            .then(userRoleIdObject=>{
                resolve(userRoleIdObject)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    createQuiz({userId, topicId, questionSet, totalMarks, obtainedMarks}){
        return new Promise((resolve, reject)=>{
            models.quiz.create({
                userId,
                topicId,
                questionSet,
                totalMarks,
                obtainedMarks
            })
            .then((quiz)=>{
                resolve(quiz)
            })
            .catch(err=>{
                console.log('CREATING QUIZ ERROR', err)
                reject(err)
            })
        })
    }
    updateQuizWithSubmittedDetails({obtainedMarks, quizId}){
        return new Promise((resolve, reject)=>{
            models.quiz.update({
                obtainedMarks
            },{
                where:{id:quizId}
            })
            .then(updatedQuiz=>{
                resolve(updatedQuiz)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
    creaeArchivedQuiz({userId, quizId}){
        return new Promise((resolve, reject)=>{
            models.archived_quiz.create({
                userId,
                quizId
            })
            .then(archived=>{
                resolve(archived)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
}

const userQueryObject = new userQuery();
module.exports = userQueryObject;