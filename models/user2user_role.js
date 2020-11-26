
module.exports = (sequelize, DataTypes)=>{
    const user2user_role = sequelize.define('user2user_role',{
        userId:{
            type: DataTypes.UUID,
            field: 'user_id'
        },
        userRoleId:{
            type: DataTypes.INTEGER,
            field:'user_role_id'
        }
    },{
        underscored:true,
        freezeTableName:true
    })
    user2user_role.associate = function(models){
        user2user_role.belongsTo(models.user, {
            foreignKey:'user_id'
        })
        user2user_role.belongsTo(models.user_role, {
            foreignKey:'user_role_id'
        })
    }
    return user2user_role;
}