module.exports = (sequelize, DataTypes)=>{
    const topic = sequelize.define('topic',{
        name:DataTypes.STRING
    },{
        underscored: true,
        freezeTableName:true,
    })
    topic.associate = function(models){
        //any knd of association goes here
    }
    return topic;
}