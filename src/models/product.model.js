import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema, model, models } = mongoose

const productSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },
    creditPrice: { type: Number, required: true, min: 0 },

    promotion: { type: Boolean, default: false },
    promotionValue: { type: Number, default: 0, min: 0 },

    details: { type: String, required: true },

    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    secondaryCategory: { type: String },
    secondarySubcategory: { type: String },

    available: { type: Boolean, default: true },

    image: { type: String, required: true },
    image2: { type: String },

    pictureId: { type: String, required: true },
    pictureId2: { type: String }
  },
  { timestamps: true }
)

productSchema.plugin(mongoosePaginate)

const Product = models.Product || model('Product', productSchema)

export default Product
