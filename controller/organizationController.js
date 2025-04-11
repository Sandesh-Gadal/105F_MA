const { QueryTypes } = require("sequelize");
const { sequelize } = require("../model");


exports.createOrganization = async (req , res) => {
    const {name , address , email , number } = req.body;
    const userId = req.userId
    if(!name || !address || !email || !number){
        return res.status(400).json({message : 'Please fill all the fields'})
    }

    const organizatonNumber = Math.floor(1000 + Math.random() * 9000);
    await sequelize.query(`Create table if not exists organization_${organizatonNumber}(
        id int auto_increment primary key not null,
        name varchar(255) not null ,
        address varchar(255) not null,
        email varchar (255) not null,
        number varchar(255) not null,
        userId int not null references users(id) on delete cascade on update cascade
        )`,{
            type :QueryTypes.CREATE
        }
    )

    await sequelize.query(`create table if not exists userhistory_${userId}(
        organizationNumber int
        )`,{
            type :QueryTypes.CREATE

        })


        await sequelize.query(` insert into organization_${organizatonNumber} (name ,address , email , number , userId) values (?,?,?,?,?)`,{
            replacements : [name , address , email , number, userId],
            type :QueryTypes.INSERT 
        })

await sequelize.query(`insert into userhistory_${userId} (organizationNumber) values (?)`,{
    replacements : [organizatonNumber],
    type :QueryTypes.INSERT
})

        res.status(200).json({
            message : "Organization created successfully" ,
            organizatonNumber : organizatonNumber
        })
}



exports.deleteUser = async(req , res) => {
  const userId = req.userId
  console.log("ooooooooooooooooooooooo", userId)
  const  userOrganization = await sequelize.query(`select * from userhistory_${userId}`,{
    type : QueryTypes.SELECT
  })
  await sequelize.query(`delete from users where id = ?`,{
    replacements : [userId],
    type : QueryTypes.DELETE
  })

  for ( var i = 0 ; i < userOrganization.length ; i++){
    await sequelize.query(`drop table organization_${userOrganization[i].organizationNumber}`,{
        type : QueryTypes.DELETE
    })
  }
  res.status(200).json({
    message : 'User and related org deleted successfully'
  })
}