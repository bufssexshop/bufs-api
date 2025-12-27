import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model, models } = mongoose

const userSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  secondLastname: { type: String, required: true },
  documentId: { type: Number, required: true, unique: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  active: { type: Boolean, required: true, default: true },
  termsAndConditions: { type: Boolean, required: true }
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
})

const User = models.User || model('User', userSchema)

export default User
