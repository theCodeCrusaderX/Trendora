import { Router } from "express";
import { getFilteredProduct, getProductDetails } from "../../controllers/shop/products.controller.js";

const router = Router();

router.route("/getProduct").get(getFilteredProduct)
router.route("/getProductDetail/:id").get(getProductDetails)

export default router;