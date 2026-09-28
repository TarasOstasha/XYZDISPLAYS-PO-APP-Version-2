const { Router } = require('express');

const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');
const optionRouter = require('./optionRouter');
const updateBuildFolderRouter = require('./updateBuildFolderRouter');
const vendorRouter = require('./vendorRouter');
const updateFolderProgressRouter = require('./updateFolderProgressRouter');
const versionRouter = require('./versionRouter');
const ftpVersionRouter = require('./ftpVersionRouter');


const router = Router();

// api
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/vendors', vendorRouter);
router.use('/option', optionRouter);
router.use('/updateFolder', updateBuildFolderRouter);
router.use('/updateFolder/progress', updateFolderProgressRouter);
router.use('/version', versionRouter);
router.use('/ftpVersion', ftpVersionRouter);


module.exports = router;
