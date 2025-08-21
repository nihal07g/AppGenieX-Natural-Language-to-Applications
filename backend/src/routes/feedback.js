import { Router } from 'express'

const router = Router()
const feedback = [] // In-memory; TODO: persist to DB or Supabase.

router.post('/feedback', (req, res) => {
  const { projectId, message, rating } = req.body || {}
  if (!message) return res.status(400).json({ ok: false, error: { code: 'BAD_REQUEST', message: 'Message required' } })
  feedback.push({ id: String(Date.now()), projectId: projectId || null, message, rating: rating ?? null })
  res.json({ ok: true, data: { received: true } })
})

export default router
