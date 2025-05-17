const router = require('express').Router()
const storeController = require('../controller/storeController')
const middleware = require('../controller/middleware')

router.get('/detail/:storeId', storeController.detailStore)

router.put('/update/:storeId', middleware.verifyToken, middleware.verifyOwner, storeController.updateInforStore)


module.exports = router