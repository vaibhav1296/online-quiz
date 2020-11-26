
module.exports = {
    up: (queryInterface, Sequelize)=>{
        return queryInterface.createTable('user',{
            id:{
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            email:{
                type: Sequelize.STRING,
                allowNull: false
            },
            hashed_password:{
                type: Sequelize.STRING,
                allowNull:false
            },
            gender_id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'gender',
                    key: 'id'
                }
            },
            created_at:{
                type: Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.literal('CURRENT_TIMESTAMP(3)')
            },
            updated_at:{
                type:Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
            }
        })
    },
    down:(queryInterface, Sequelize)=>{
        return queryInterface.dropTable('user')
    }
}