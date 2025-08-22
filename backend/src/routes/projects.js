import { Router } from 'express'

const router = Router()
const projects = [] // In-memory; TODO: persist to DB or Supabase.

router.get('/projects', (_req, res) => {
  res.json({ ok: true, data: { projects } })
})

router.post('/projects', (req, res) => {
  const { name, files } = req.body || {}
  if (!name || !Array.isArray(files)) {
    return res
      .status(400)
      .json({
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid project payload' },
      })
  }
  const id = String(Date.now())
  projects.push({ id, name, files, createdAt: new Date().toISOString() })
  res.json({ ok: true, data: { id } })
})

export default router
