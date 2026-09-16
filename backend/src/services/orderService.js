import prisma from "../lib/prisma.js";

export const createOrder = async (userId, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Cart cannot be empty");
    error.statusCode = 400;
    throw error;
  }

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

  let total = 0;
  const orderItems = items.map((item) => {
    const product = products.find(
      (product) => product.product_id === item.product_id,
    );

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      const error = new Error("Invalid quantity");
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`Not enough stock for ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    total += product.price * item.quantity;

    return {
      product_id: product.product_id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
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

    for (const item of orderItems) {
      await tx.product.update({
        where: {
          product_id: item.product_id,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return tx.order.findUnique({
      where: {
        id: newOrder.id,
      },
      include: {
        orderItems: true,
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
