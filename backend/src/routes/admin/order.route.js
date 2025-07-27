import {Router} from 'express'
import { getAllOrdersForAllUser, getOrderDetails, updateOrderStatus } from '../../controllers/admin/order.controller.js';


const router = Router()

router.route('/get').get(getAllOrdersForAllUser)
router.route('/details/:id').get(getOrderDetails)
router.route('/update/:id').put(updateOrderStatus)

export default router;