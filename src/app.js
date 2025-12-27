import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { connectDB } from './config/db.js'
import { errorHandler } from './shared/errors/errorHandler.js'

import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'

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

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true
    })
  )

  app.use('/products', productRouter)
  app.use('/users', userRouter)

  app.use(errorHandler)

  return app
}
