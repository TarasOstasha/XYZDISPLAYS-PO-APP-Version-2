const { Router } = require('express');
const { productController } = require('../controllers');
//const { paginate, upload } = require('../middleware');

// api/users
const productRouter = Router();

productRouter
  .route('/')
  .get(productController.getProducts)



productRouter
  .route('/:id')
  .get(productController.getProductById)



module.exports = productRouter;