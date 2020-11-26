

module.exports = {
    up: (queryInterface, Sequelize)=>{
        return queryInterface.createTable('topic2question',{
            id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            topic_id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'topic',
                    key:'id'
                }
            },
            question_id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'question',
                    key:"id"
                }
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
        return queryInterface.dropTable('topic2question')
    }
}