import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { OrderController } from './orders.controller';

const router = express.Router();

router.post(
  '/create-order',
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderController.createOrder,
);

router.get('/', OrderController.getAllOrders);

router.get('/:id', OrderController.getSingleOrder);

router.get('/user/:userId', OrderController.getOrderByUserId);

router.get('/product/:productId', OrderController.getOrderByProductId);

router.patch('/:id', OrderController.updateOrder);

router.delete('/:id', OrderController.deleteOrder);

export const OrderRoutes = router;
