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

  // LOGS PARA DEBUGGING
  console.log('🔧 CORS Configuration:')
  console.log('  FRONTEND:', process.env.FRONTEND)
  console.log('  ADMON:', process.env.ADMON)
  console.log('  DEV:', process.env.DEV)

  app.use(
    cors({
      origin: (origin, callback) => {
        // Lista de orígenes permitidos desde variables de entorno
        const allowedOrigins = [
          process.env.FRONTEND,
          process.env.ADMON,
          process.env.DEV,
          'http://localhost:3000'
        ].filter(Boolean)

        console.log('📥 Incoming request from origin:', origin)
        console.log('✅ Allowed origins:', allowedOrigins)

        // Permitir requests sin origin (Postman, curl, mobile apps, etc.)
        if (!origin) {
          console.log('✅ No origin header - allowing request')
          return callback(null, true)
        }

        // Verificar si el origin está en la lista exacta
        if (allowedOrigins.includes(origin)) {
          console.log('✅ Origin match found - allowing request')
          return callback(null, true)
        }

        // Permitir todos los preview deployments de Vercel
        if (origin.endsWith('.vercel.app')) {
          console.log('✅ Vercel deployment detected - allowing request')
          return callback(null, true)
        }

        // Rechazar otros orígenes
        console.log('❌ CORS BLOCKED - Origin not in allowed list')
        callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  app.use('/products', productRouter)
  app.use('/users', userRouter)
  app.use(errorHandler)

  return app
}