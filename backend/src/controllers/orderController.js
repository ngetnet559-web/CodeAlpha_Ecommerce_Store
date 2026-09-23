import {
  createOrder as createOrderService,
  getUserOrders,
} from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      items,
      fullName,
      phone,
      address,
      city,
      paymentMethod,
    } = req.body;

    const order = await createOrderService(userId, items, {
      fullName,
      phone,
      address,
      city,
      paymentMethod,
    });

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