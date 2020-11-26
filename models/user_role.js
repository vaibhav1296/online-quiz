
module.exports = (sequelize, DataTypes)=>{
    const user_role = sequelize.define('user_role',{
        name:DataTypes.STRING,
        emailDomain:{
            type: DataTypes.STRING,
            field: 'email_domain'
        }
    },{
        underscored:true,
        freezeTableName:true
    })
    user_role.associate = function(models){
        //any kind of association goes here
    }
    return user_role;
}
