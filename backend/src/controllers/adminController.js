import { getAdminDashboard } from "../services/adminService.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getAdminDashboard();

    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
};