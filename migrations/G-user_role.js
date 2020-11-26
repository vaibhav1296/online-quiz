
module.exports = {
    up:(queryInterface, Sequelize)=>{
        return queryInterface.createTable('user_role', {
            id:{
                type:Sequelize.INTEGER,
                allowNull: false,
                autoIncrement:true,
                primaryKey: true
            },
            name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            email_domain:{
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
    down: (queryInterface, Sequelize)=>{
        return queryInterface.dropTable('user_role')
    }
}