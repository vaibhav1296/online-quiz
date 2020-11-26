module.exports = (sequelize, DataTypes)=>{
    const topic2question = sequelize.define('topic2question',{
        topicId:{
            type: DataTypes.INTEGER,
            field:'topic_id'
        },
        questionId:{
            type: DataTypes.INTEGER,
            field: 'question_id'
        }
    },{
        underscored: true,
        freezeTableName: true
    })
    topic2question.associate = function(models){
        topic2question.belongsTo(models.topic,{
            foreignKey: 'topicId'
        })
        topic2question.belongsTo(models.question,{
            foreignKey:"questionId"
        })
    }
    return topic2question;
}