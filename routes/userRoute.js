const { registerUser , loginUser} = require('../controller/authController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

const router = require('express').Router();

router.route('/register').post(registerUser)
router.route('/login').post( isAuthenticated , loginUser)






module.exports = router;