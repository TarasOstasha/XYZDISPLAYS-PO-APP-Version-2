const { Router } = require('express');

const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');
const optionRouter = require('./optionRouter');
const updateBuildFolderRouter = require('./updateBuildFolderRouter');
const vendorRouter = require('./vendorRouter');



const router = Router();

// api
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/vendors', vendorRouter);
router.use('/option', optionRouter);
router.use('/updateFolder', updateBuildFolderRouter);

module.exports = router;




