import { Router } from "express";
import { addToCart, deleteCartItem, fetchCartItems, updateCartItemQty } from "../../controllers/shop/cart.controller.js";

const router = Router();

router.route("/add").post(addToCart)
router.route("/get/:userId").get(fetchCartItems)
router.route("/update-cart").put(updateCartItemQty)
router.route("/delete/:userId/:productId").delete(deleteCartItem)

export default router;