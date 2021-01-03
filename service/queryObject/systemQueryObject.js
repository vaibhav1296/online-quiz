const models = require("../../models/index");

class systemQuery {
  getGenderId(type) {
    return new Promise((resolve, reject) => {
      models.gender
        .findOne({
          where: { type },
          attributes: ["id"],
        })
        .then((gender) => {
          resolve(gender);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getRoleByEmailDomain(emailDomain) {
    return new Promise((resolve, reject) => {
      models.user_role
        .findOne({
          where: { emailDomain },
        })
        .then((userRole) => {
          resolve(userRole);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getRoleByRoleId(id) {
    return new Promise((resolve, reject) => {
      models.user_role
        .findOne({
          where: { id },
        })
        .then((userRoleObject) => {
          resolve(userRoleObject);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  addNewTopic(name) {
    return new Promise((resolve, reject) => {
      models.topic
        .create({
          name,
        })
        .then((topic) => {
          resolve(topic);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getTopicByName(name) {
    return new Promise((resolve, reject) => {
      models.topic
        .findOne({
          where: { name },
        })
        .then((topic) => {
          resolve(topic);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  addNewQuestion(question) {
    return new Promise((resolve, reject) => {
      models.question
        .create({
          name: question,
        })
        .then((question) => {
          resolve(question);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  addTopic2Question(topicId, questionId) {
    return new Promise((resolve, reject) => {
      models.topic2question
        .create({
          topicId,
          questionId,
        })
        .then((topic2Question) => {
          resolve(topic2Question);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllTopics() {
    return new Promise((resolve, reject) => {
      models.topic
        .findAll({
          attributes: [
            "id",
            "name",
            "topic_description",
            "topic_test_detail",
            "createdAt",
            "updatedAt",
          ],
        })
        .then((topics) => {
          resolve(topics);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getGenderName(id) {
    return new Promise((resolve, reject) => {
      models.gender
        .findOne({
          where: { id },
          attributes: ["type"],
        })
        .then((gender) => {
          resolve(gender);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getQuestionsByTopicId(topicId) {
    return new Promise((resolve, reject) => {
      models.topic2question
        .findAll({
          where: { topicId },
          include: [
            {
              model: models.question,
              attributes: ["id", "name"],
            },
          ],
        })
        .then((questionObject) => {
          resolve(questionObject);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
const systemQueryObeject = new systemQuery();
module.exports = systemQueryObeject;
