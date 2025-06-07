const router = require('express').Router()
const authController = require('../controller/authController')


router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)

router.post('/google-login', authController.googleLogin);


module.exports = router