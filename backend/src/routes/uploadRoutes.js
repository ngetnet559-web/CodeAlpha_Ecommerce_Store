import e from "express";

import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middleware/uploadImage.js";

const router = e.Router();

router.post("/", upload.single("image"), uploadImage);

export default router;