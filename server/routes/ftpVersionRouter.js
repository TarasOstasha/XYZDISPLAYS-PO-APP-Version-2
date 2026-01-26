const { Router } = require('express');
const { ftpVersionController } = require('../controllers');

const ftpVersionRouter = Router();

ftpVersionRouter
  .route('/')
  .get(ftpVersionController.getFTPVersion);

module.exports = ftpVersionRouter;
