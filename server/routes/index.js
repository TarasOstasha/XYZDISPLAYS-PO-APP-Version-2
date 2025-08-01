const { Router } = require('express');

const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');
const optionRouter = require('./optionRouter');
const updateBuildFolderRouter = require('./updateBuildFolderRouter');
const vendorRouter = require('./vendorRouter');
const updateFolderProgressRouter = require('./updateFolderProgressRouter');
const updateServerRouter = require('./updateServerFolderRouter');


const router = Router();

// api
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/vendors', vendorRouter);
router.use('/option', optionRouter);
router.use('/updateFolder', updateBuildFolderRouter);
router.use('/updateServer', updateServerRouter) // did not finish, need to create front end logic for this
router.use('/updateFolder/progress', updateFolderProgressRouter);


module.exports = router;




