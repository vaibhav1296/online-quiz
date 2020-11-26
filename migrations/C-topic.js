module.exports = {
    up: (queryInterface, Sequelize)=>{
        return queryInterface.createTable('topic',{
            id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            created_at:{
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
            },
            updated_at:{
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
            }
        })
    },
    down:(queryInterface, Sequelize)=>{
        return queryInterface.dropTable('topic')
    }
}