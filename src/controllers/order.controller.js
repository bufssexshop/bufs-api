import Order from '../models/order.model.js';
import User from '../models/user.model.js';

// Crear nueva orden
export async function createOrder(req, res, next) {
  try {
    const { items, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'El pedido debe contener al menos un producto'
      });
    }

    // Obtener datos del usuario
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar número de orden
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;

    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal;

    const orderData = {
      orderNumber, // ← Agregar explícitamente
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      items,
      notes: notes || '',
      subtotal,
      total
    };

    const newOrder = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      order: newOrder
    });
  } catch (error) {
    next(error);
  }
}

// Obtener órdenes del usuario actual
export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
}

// Obtener todas las órdenes (solo admin)
export async function getAllOrders(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Acceso denegado'
      });
    }

    const { status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
}

// Obtener detalle de una orden
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Si no es admin, verificar que sea su orden
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
}

// Actualizar estado de orden (solo admin)
export async function updateOrderStatus(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Estado inválido'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Estado actualizado correctamente',
      order
    });
  } catch (error) {
    next(error);
  }
}