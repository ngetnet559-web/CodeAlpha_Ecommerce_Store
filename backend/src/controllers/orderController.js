import {
  createOrder as createOrderService,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus as updateOrderStatusService,
} from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, fullName, phone, address, city, paymentMethod } = req.body;

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

export const getOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await getOrderById(orderId, userId);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const { status } = req.body;

    const order = await updateOrderStatusService(orderId, status);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
