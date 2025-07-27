import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import {handleImageUpload, addProduct, fetchAllProduct, editProduct, deleteProduct } from "../../controllers/admin/products.controller.js";

const router = Router();

router.route("/img-upload").post(upload.single("my_file"),handleImageUpload)
router.route("/addProduct").post(addProduct)
router.route("/getProduct").get(fetchAllProduct)
router.route("/editProduct/:id").put(editProduct)
router.route("/deleteProduct/:id").delete(deleteProduct)

export default router;