module.exports = (sequelize, DataTypes)=>{
    const quiz = sequelize.define('quiz',{
        userId:{
            type: DataTypes.UUID,
            field:'user_id'
        },
        topicId:{
            type:DataTypes.INTEGER,
            field:'topic_id'
        },
        questionSet:{
            type: DataTypes.JSON,
            field: 'question_set'
        },
        totalMarks:{
            type: DataTypes.INTEGER,
            field: 'total_marks'
        },
        obtainedMarks:{
            type: DataTypes.INTEGER,
            field:'obtained_marks'
        }
    },{
        underscored: true,
        freezeTableName: true
    })
    quiz.associate = function(models){
        quiz.belongsTo(models.user,{
            foreignKey:'userId'
        })
        quiz.belongsTo(models.topic,{
            foreignKey: 'topicId'
        })

    }
    return quiz;
}