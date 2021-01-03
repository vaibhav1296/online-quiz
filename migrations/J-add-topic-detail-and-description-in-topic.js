module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn(
        "topic",
        "topic_test_detail",
        Sequelize.TEXT
      ),
      await queryInterface.addColumn(
        "topic",
        "topic_description",
        Sequelize.TEXT
      ),
    ];
  },
  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn(
        "topic",
        "topic_test_detail",
        Sequelize.TEXT
      ),
      await queryInterface.removeColumn(
        "topic",
        "topic_description",
        Sequelize.TEXT
      ),
    ];
  },
};
