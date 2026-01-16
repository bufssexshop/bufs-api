import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productCode: { type: String, required: true },
  productImage: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  items: [orderItemSchema],

  notes: { type: String, default: '' },

  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },

  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = models.Order || model('Order', orderSchema);

export default Order;