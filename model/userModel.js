
module.exports= (sequelize , DataTypes) => {
    const User = sequelize.define("user",{
        username:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        currentOrganization:{
            type: DataTypes.STRING,
            allowNull:true,
        },
        currentOrganizationisdisplayed:{
            type: DataTypes.BOOLEAN,
         
        }
    })
    return User;
}