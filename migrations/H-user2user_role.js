
module.exports = {
    up: (queryInterface, Sequelize)=>{
        return queryInterface.createTable('user2user_role', {
            id:{
                type:Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            user_id:{
                type: Sequelize.UUID,
                allowNull: false,
                references:{
                    model:'user',
                    key:'id'
                }
            },
            user_role_id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'user_role',
                    key:'id'
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
    down: (queryInterface, Sequelize)=>{
        return queryInterface.dropTable('user2user_role')
    }
}