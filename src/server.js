import 'dotenv/config'
import { createApp } from './app.js'

const PORT = process.env.PORT || 8000

const startServer = async () => {
  const app = await createApp()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
})

startServer()