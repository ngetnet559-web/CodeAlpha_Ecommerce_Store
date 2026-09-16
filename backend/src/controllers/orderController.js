import {
  createOrder as createOrderService,
  getUserOrders,
} from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const order = await createOrderService(userId, items);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await getUserOrders(userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};