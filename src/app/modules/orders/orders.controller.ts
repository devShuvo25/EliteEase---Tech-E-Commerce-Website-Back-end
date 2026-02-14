import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.createOrder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrders();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderServices.getSingleOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const getOrderByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await OrderServices.getOrderByUserId(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders by user retrieved successfully',
    data: result,
  });
});

const getOrderByProductId = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await OrderServices.getOrderByProductId(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders by product retrieved successfully',
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderServices.updateOrder(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderServices.deleteOrder(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getOrderByUserId,
  getOrderByProductId,
  updateOrder,
  deleteOrder,
};
