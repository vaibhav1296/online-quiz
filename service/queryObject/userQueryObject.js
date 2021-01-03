const models = require("../../models/index");
class userQuery {
  findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      models.user
        .findOne({
          where: { email },
        })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  createNewUser(user) {
    return new Promise((resolve, reject) => {
      models.user
        .create({
          email: user.email,
          name: user.name,
          hashedPassword: user.hashedPassword,
          genderId: user.genderId,
        })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  createUser2UserRole(userId, userRoleId) {
    return new Promise((resolve, reject) => {
      models.user2user_role
        .create({
          userId,
          userRoleId,
        })
        .then((user2UserRole) => {
          resolve(user2UserRole);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getUserRoleIdByUserId(userId) {
    return new Promise((resolve, reject) => {
      models.user2user_role
        .findOne({
          where: { userId },
        })
        .then((userRoleIdObject) => {
          resolve(userRoleIdObject);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  createQuiz({ userId, topicId, questionSet, totalMarks, obtainedMarks }) {
    return new Promise((resolve, reject) => {
      models.quiz
        .create({
          userId,
          topicId,
          questionSet,
          totalMarks,
          obtainedMarks,
        })
        .then((quiz) => {
          resolve(quiz);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updateQuizWithSubmittedDetails({ obtainedMarks, quizId }) {
    return new Promise((resolve, reject) => {
      models.quiz
        .update(
          {
            obtainedMarks,
          },
          {
            where: { id: quizId },
          }
        )
        .then((updatedQuiz) => {
          resolve(updatedQuiz);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  creaeArchivedQuiz({ userId, quizId }) {
    return new Promise((resolve, reject) => {
      models.archived_quiz
        .create({
          userId,
          quizId,
        })
        .then((archived) => {
          resolve(archived);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async getAllArchivedQuizCount(userId) {
    return models.archived_quiz.count({
      where: { userId },
    });
  }

  getAllArchivedQuizDetails(userId, offset, limit) {
    return new Promise((resolve, reject) => {
      models.archived_quiz
        .findAll({
          offset,
          limit,
          where: { userId },
          attributes: ["userId", "quizId"],
          include: [
            {
              model: models.quiz,
              attributes: [
                "topicId",
                "obtainedMarks",
                "totalMarks",
                "createdAt",
              ],
              include: [
                {
                  model: models.topic,
                  attributes: ["name"],
                },
              ],
            },
          ],
        })
        .then((archivedQuiz) => {
          resolve(archivedQuiz);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getQuizById(id) {
    return new Promise((resolve, reject) => {
      models.quiz
        .findOne({
          where: { id },
        })
        .then((quiz) => {
          resolve(quiz);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const userQueryObject = new userQuery();
module.exports = userQueryObject;
