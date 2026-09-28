const { Router } = require('express');
const { vendorController } = require('../controllers');
//const { paginate, upload } = require('../middleware');

// api/users
const vendorRouter = Router();

vendorRouter
  .route('/')
  .get(vendorController.getvendors)



vendorRouter
  .route('/:id')
  .get(vendorController.getvendorById)
  



module.exports = vendorRouter;