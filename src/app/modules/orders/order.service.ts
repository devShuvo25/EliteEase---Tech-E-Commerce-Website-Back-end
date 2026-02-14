import prisma from '../../utils/prisma';

const createOrder = async (data: any) => {
  const result = await prisma.order.create({
    data,
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          quantity: true,
          price: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
  return result;
};
// geting all Orders from db
const getAllOrders = async () => {
  const result = await prisma.order.findMany({
    include: {
      items: true,
      user: {
        select: { id: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          quantity: true,
          price: true,
        },
      },
      user: {
        select: { id: true, email: true },
      },
    },
  });
  return result;
};
// get oderByUserId from Db
const getOrderByUserId = async (userId: string) => {
  const result = await prisma.order.findMany({
    where: {
      userId: userId,
    },
  });
  return result;
};
// get orderBy Product id from Db
const getOrderByProductId = async (productId: string) => {
  const result = await prisma.order.findMany({
    where: {
      items: {
        some: {
          productId: productId,
        },
      },
    },
    include: {
      items: true,
      user: { select: { id: true, email: true } },
    },
  });
  return result;
};
// update order by orderId
const updateOrder = async (id: string, payload: any) => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};
// delet order by orderID
const deleteOrder = async (id: string) => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getOrderByUserId,
  getOrderByProductId,
  updateOrder,
  deleteOrder,
};
