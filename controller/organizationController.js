const { QueryTypes } = require("sequelize");
const { sequelize, users } = require("../model");


exports.createOrganization = async (req , res , next) => {
    const {name , address , email , number } = req.body;
    const userId = req.userId
    if(!name || !address || !email || !number){
        return res.status(400).json({message : 'Please fill all the fields'})
    }


    const organizatonNumber = Math.floor(1000 + Math.random() * 9000);
    
    const userData = await users.findByPk(userId)
    userData.currentOrganization = organizatonNumber
    await userData.save()
    
    
    
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

        // res.status(200).json({
        //     message : "Organization created successfully" ,
        //     organizatonNumber : organizatonNumber
        // })
        req.userId = userId
        req.organizationNumber = organizatonNumber
        next()
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


exports.createBlogTable = async (req,res) => {
  // const userId = req.userId
  const organizationNumber = req.organizationNumber

  await sequelize.query(`CREATE TABLE blog_${organizationNumber}(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    createdBy INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)`,{
    type : QueryTypes.CREATE 

})

// await sequelize.query(`INSERT INTO blog_${organizationNumber} (title,subtitle,description,image,createdBy) VALUES('seedtitle','test','desc','image',2)`,{
//   type : QueryTypes.INSERT
// })

res.status(200).json({
  message : 'Blog table created successfully',
  organizationNumber : organizationNumber
})

}

exports.insertIntoBlogTable = async (req,res)=>{
  const {userId , organizationNumber } = req
  console.log(userId , organizationNumber)
  console.log(req.body)
  const {title , subtitle , description , image} = req.body
  if(!title || !subtitle || !description || !image){
    return res.status(400).json({
      message : 'Please fill all the fields'
    })
  }
  await sequelize.query(`insert into blog_${organizationNumber} (title , subtitle , description , image , createdBy) values (?,?,?,?,?)`,{
    replacements : [title , subtitle , description , image , userId],
    type : QueryTypes.INSERT
  })
  res.status(200).json({
    message : 'Blog created successfully'
  })

}