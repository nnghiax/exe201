const router = require('express').Router()
const authController = require('../controller/authController')


router.post('/register', authController.registerUser)

router.post('/login', authController.loginUser)

router.post('/google-login', authController.googleLogin);

router.post('/forget-password', authController.forgotPassword)

router.post('/verify-otp', authController.verifyOtp)


module.exports = router