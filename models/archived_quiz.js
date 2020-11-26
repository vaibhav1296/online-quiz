
module.exports = (sequelize, DataTypes)=>{
    const archived_quiz = sequelize.define('archived_quiz',{
        userId:{
            type: DataTypes.UUID,
            field:'user_id'
        },
        quizId:{
            type: DataTypes.INTEGER,
            field:'quiz_id'
        }
    },{
        underscored:true,
        freezeTableName:true
    })
    archived_quiz.associate = function(models){
        archived_quiz.belongsTo(models.user,{
            foreignKey:'userId'
        })
        archived_quiz.belongsTo(models.quiz,{
            foreignKey:'quizId'
        })
    }
    return archived_quiz;
}