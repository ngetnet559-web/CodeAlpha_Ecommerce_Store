import prisma from "../lib/prisma.js";

export const getAdminDashboard = async () => {
  const [
    productCount,
    orderCount,
    customerCount,
    pendingOrderCount,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.order.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          not: "CANCELLED",
        },
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    statistics: {
      productCount,
      orderCount,
      customerCount,
      pendingOrderCount,
      revenue: revenueResult._sum.total || 0,
    },
    recentOrders,
  };
};
