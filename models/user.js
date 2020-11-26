module.exports = (sequelize, DataTypes)=>{
    const user = sequelize.define(
        'user',
        {
            id:{
                allowNull: false,
                primaryKey: true,
                type:DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4
            },
            name:DataTypes.STRING,
            email:DataTypes.STRING,
            hashedPassword:{
                type: DataTypes.STRING,
                field:'hashed_password'
            },
            genderId:{
                type:DataTypes.INTEGER,
                field:"gender_id"
            }
        },{
            underscored:true,
            freezeTableName:true
        }
    );
    user.associate = function(models){
        user.belongsTo(models.gender, {
            foreignKey:'genderId'
        })
    }
    return user;
}