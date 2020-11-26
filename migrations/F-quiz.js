module.exports = {
    up: (queryInterface, Sequelize)=>{
        return queryInterface.createTable('quiz',{
            id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            user_id:{
                type: Sequelize.UUID,
                allowNull: false,
                references:{
                    model: 'user',
                    key: 'id'
                }
            },
            topic_id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'topic',
                    key:'id'
                }
            },
            question_set:{
                type: Sequelize.JSON,
                allowNull: false
            },
            total_marks:{
                type: Sequelize.INTEGER,
                allowNull: false
            },
            obtained_marks:{
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('quiz')
    }
}