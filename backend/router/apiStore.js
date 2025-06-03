const router = require('express').Router()
const storeController = require('../controller/storeController')
const middleware = require('../controller/middleware')
const {uploadCloud} = require('../controller/imageUpload')

router.get('/count', middleware.verifyToken, middleware.verifyAdmin, storeController.countStore)

router.get('/list', storeController.listStore)

router.get('/detail/:storeId', storeController.detailStore)

router.put('/update/:storeId', middleware.verifyToken, middleware.verifyOwner, uploadCloud.single('image'), storeController.updateInforStore)


module.exports = router