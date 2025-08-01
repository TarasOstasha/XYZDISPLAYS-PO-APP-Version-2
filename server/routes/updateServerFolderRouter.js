const { Router } = require('express');
const { updateServerController } = require('../controllers');


const updateServerRouter = Router();

updateServerRouter
  .route('/')
  .get(updateServerController.updateServerFolder)




module.exports = updateServerRouter;