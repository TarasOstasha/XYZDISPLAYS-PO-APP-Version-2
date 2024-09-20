const { Router } = require('express');
const { optionController } = require('../controllers');
//const { paginate, upload } = require('../middleware');

// api/option
const optionRouter = Router();

optionRouter
  .route('/')
  .get(optionController.getOptions)
  .post(optionController.saveOption)


optionRouter
  .route('/:id')
  .get(optionController.getOptionById)



module.exports = optionRouter;