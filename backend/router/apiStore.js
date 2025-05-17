const router = require('express').Router()
const storeController = require('../controller/storeController')
const middleware = require('../controller/middleware')
const imageUpload = require('../controller/imageUpload')
const uploadCloud = require('../controller/imageUpload')

router.get('/detail/:storeId', storeController.detailStore)

router.put('/update/:storeId', middleware.verifyToken, middleware.verifyOwner, uploadCloud.single('image'), storeController.updateInforStore)


module.exports = router