const { Router } = require('express');
const { versionController } = require('../controllers');

const versionRouter = Router();

versionRouter
  .route('/')
  .get(versionController.getVersion);

module.exports = versionRouter;
