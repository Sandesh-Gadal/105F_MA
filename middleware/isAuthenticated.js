const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const {users} = require("../model/index.js")

exports.isAuthenticated = async (req , res , next)=> {
 const token = req.cookies.jwttoken
 console.log(token)
 if(!token || token === undefined || token === null){
    return res.status(400).json({
        message : 'Token not found or login '
    })
 }
//if token comes then verify it
  const verifiedResult =  await promisify(jwt.verify)(token, "thisismysecretKey")
  const user = await users.findByPk(verifiedResult.id)
  if(!user){
    return res.status(404).json({
        message : 'User not found'
    })
  }
  req.userId = verifiedResult.id
  next()
}