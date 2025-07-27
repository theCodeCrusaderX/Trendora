import {Router} from 'express'
import { capturePayment, createOrder, getAllOrdersByUser, getOrderDetails } from '../../controllers/shop/order.controller.js';


const router = Router()
router.route('/create').post(createOrder)
router.route('/capture').post(capturePayment)
router.route('/list/:userId').get(getAllOrdersByUser)
router.route('/details/:id').get(getOrderDetails)

export default router;