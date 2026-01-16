import express from 'express';
import auth from '../utils/auth.js';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/order.controller.js';

const router = express.Router();

// Rutas para clientes
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

// Rutas para admin
router.get('/', auth, getAllOrders);
router.patch('/:id/status', auth, updateOrderStatus);

export default router;