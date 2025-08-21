import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
try {
  dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') })
} catch {}
import express from 'express'
import pino from 'pino'
import { corsMiddleware } from './middleware/cors.js'
import generateRoute from './routes/generate.js'
import modifyRoute from './routes/modify.js'
import projectsRoute from './routes/projects.js'
import feedbackRoute from './routes/feedback.js'
import zipRoute from './routes/zip.js'

const app = express()
const logger = pino({ transport: { target: 'pino-pretty' } })

app.use(express.json({ limit: '2mb' }))
app.use(corsMiddleware)

app.get('/health', (_req, res) => {
  res.json({ ok: true, data: { service: 'backend', status: 'healthy' } })
})

app.use('/api', generateRoute)
app.use('/api', modifyRoute)
app.use('/api', projectsRoute)
app.use('/api', feedbackRoute)
app.use('/api', zipRoute)

// Error handler
app.use((err, _req, res, _next) => {
  logger.error(err)
  res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  logger.info(`Backend listening on http://localhost:${PORT}`)
})
