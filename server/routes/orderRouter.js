const { Router } = require('express');
const { orderController } = require('../controllers');
//const { paginate, upload } = require('../middleware');

// api/users
const orderRouter = Router();

orderRouter
  .route('/')
  .get(orderController.getOrders)
  .post(orderController.saveOrder)


orderRouter
  .route('/:id')
  .get(orderController.getOrderById)



module.exports = orderRouter;