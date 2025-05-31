const router = require('express').Router()
const middleware = require('../controller/middleware')
const userController = require('../controller/userController')


router.get('/count', middleware.verifyToken, middleware.verifyAdmin, userController.countUser)

router.get('/list', middleware.verifyToken, middleware.verifyAdmin, userController.listUser)




module.exports = router