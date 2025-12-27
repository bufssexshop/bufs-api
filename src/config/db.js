import mongoose from 'mongoose';

export const connectDB = async () => {
  const isProd = process.env.NODE_ENV === 'production'

  const uri = isProd
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV

  if (!uri) {
    console.error('MongoDB URI is not defined for the current environment')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
      console.log(`MongoDB connected (${isProd ? 'prod' : 'dev'})`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}