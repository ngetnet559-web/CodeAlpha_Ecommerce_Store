import prisma from "../lib/prisma.js";

export const createOrder = async (userId, items, checkoutData) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Cart cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const { fullName, phone, address, city, paymentMethod } = checkoutData;

  const productIds = items.map((item) => item.product_id);
  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    const error = new Error("Duplicate products are not allowed");
    error.statusCode = 400;
    throw error;
  }

  const products = await prisma.product.findMany({
    where: {
      product_id: {
        in: [...uniqueProductIds],
      },
    },
  });

  if (products.length !== productIds.length) {
    const error = new Error("One or more products not found");
    error.statusCode = 404;
    throw error;
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      const error = new Error("Invalid quantity");
      error.statusCode = 400;
      throw error;
    }

    const product = products.find(
      (product) => product.product_id === item.product_id,
    );

    subtotal += Number(product.price) * item.quantity;

    orderItems.push({
      product_id: product.product_id,
      quantity: item.quantity,
      price: Number(product.price),
    });
  }

  const shippingFee = subtotal > 0 ? 5 : 0;

  const total = Number((subtotal + shippingFee).toFixed(2));

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          product_id: item.product_id,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count === 0) {
        const product = products.find(
          (product) => product.product_id === item.product_id,
        );

        const error = new Error(`Not enough stock for ${product.name}`);

        error.statusCode = 400;
        throw error;
      }
    }

    const newOrder = await tx.order.create({
      data: {
        userId,
        fullName,
        phone,
        address,
        city,
        paymentMethod,
        status: "PENDING",
        shippingFee,
        total,
      },
    });

    await tx.orderItem.createMany({
      data: orderItems.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return tx.order.findUnique({
      where: {
        id: newOrder.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  return order;
};

export const getUserOrders = async (userId) => {
  return await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrderById = async (orderId, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateOrderStatus = async (orderId, status) => {
  const allowedTransitions = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    if (!allowedTransitions[order.status]?.includes(status)) {
      const error = new Error(
        `Cannot change order status from ${order.status} to ${status}`,
      );

      error.statusCode = 400;
      throw error;
    }

    if (status === "CANCELLED") {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: {
            product_id: item.product_id,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });
  });
};
