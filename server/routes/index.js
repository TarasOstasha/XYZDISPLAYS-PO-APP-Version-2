const { Router } = require('express');

const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');
const optionRouter = require('./optionRouter');
const updateBuildFolderRouter = require('./updateBuildFolderRouter');
const vendorRouter = require('./vendorRouter');
const updateFolderProgressRouter = require('./updateFolderProgressRouter');
const versionRouter = require('./versionRouter');
const ftpVersionRouter = require('./ftpVersionRouter');
const authRouter = require('./authRouter');
const { requireAuth } = require('../middleware/auth');


const router = Router();

// public
router.use('/auth', authRouter);

// protected
router.use(requireAuth);
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/vendors', vendorRouter);
router.use('/option', optionRouter);
router.use('/updateFolder', updateBuildFolderRouter);
router.use('/updateFolder/progress', updateFolderProgressRouter);
router.use('/version', versionRouter);
router.use('/ftpVersion', ftpVersionRouter);


module.exports = router;
