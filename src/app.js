import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import { errorHandler } from './shared/errors/errorHandler.js'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import orderRouter from './routes/order.routes.js'

export async function createApp () {
  await connectDB()
  const app = express()

  app.use(express.json({ limit: '10mb' }))
  app.use(morgan('dev'))

  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          process.env.FRONTEND,
          process.env.ADMON,
          process.env.DEV,
          'http://localhost:3000'
        ].filter(Boolean)

        // Permitir requests sin origin (Postman, curl, etc.)
        if (!origin) {
          return callback(null, true)
        }

        // Verificar si el origin está en la lista
        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        }

        // Permitir preview deployments de Vercel
        if (origin.endsWith('.vercel.app')) {
          return callback(null, true)
        }

        // Rechazar otros orígenes
        callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  // Routes
  app.use('/products', productRouter)
  app.use('/users', userRouter)
  app.use('/orders', orderRouter)

  // Error handler (siempre al final)
  app.use(errorHandler)

  return app
}