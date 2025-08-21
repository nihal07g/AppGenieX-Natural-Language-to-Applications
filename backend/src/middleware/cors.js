import cors from 'cors'

const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

export const corsMiddleware = cors({
  origin: FRONTEND,
  credentials: false,
})
