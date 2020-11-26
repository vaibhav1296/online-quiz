module.exports = (sequelize, DataTypes)=>{
    const question = sequelize.define('question',{
        name: DataTypes.JSON
    },{
        underscored: true,
        freezeTableName: true
    })
    question.associate = function(models){
        //any kind of association goes here
    }
    return question;
}