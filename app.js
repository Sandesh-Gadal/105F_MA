const express = require('express');
const app = express();
const authroute = require('./routes/userRoute');
const organizationroute = require('./routes/organizationRoute');
const cookieParser = require('cookie-parser');
const {isAuthenticated} = require('./middleware/isAuthenticated')
const jwt = require('jsonwebtoken')
const {promisify} = require('util')


require('./model/index')
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use("", authroute);
app.use("", organizationroute);
const PORT = 3000;

app.use(async(req,res,next)=>{
    res.locals.currentUser = req.cookies.jwttoken
    if(req.cookies.jwttoken){
        const data = await promisify(jwt.verify)(req.cookies.jwttoken,  "thisismysecretKey")
 res.locals.currentUserId = data.id
    }
    next()
})
app.listen(PORT,()=>{
    console.log('Server is running on port 3000');
})
