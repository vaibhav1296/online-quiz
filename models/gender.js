module.exports = (sequelize, DataTypes)=>{
    const gender = sequelize.define('gender',{
        type:DataTypes.STRING
    },{
        underscored:true,
        freezeTableName:true
    })
    gender.associate = function(models){
        //any kind of association goes here
    }
    return gender;
}