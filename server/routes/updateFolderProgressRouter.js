const { Router } = require('express');
const { updateFolderProgressController } = require('../controllers');


const updateFolderProgressRouter = Router();


updateFolderProgressRouter
  .route('/')
  .get(updateFolderProgressController.progressBuildFolder);




module.exports = updateFolderProgressRouter;