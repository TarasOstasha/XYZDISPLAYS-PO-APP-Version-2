const { Router } = require('express');
const { updateBuildController } = require('../controllers');

const updateFolderRouter = Router();

updateFolderRouter
  .route('/')
  .get(updateBuildController.updateBuildFolder)







module.exports = updateFolderRouter;