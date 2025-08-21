export function analyzeQuality(files) {
  let loc = 0
  let funcs = 0
  let complexity = 0
  for (const f of files) {
    const content = f.content || ''
    const lines = content.split(/\r?\n/)
    loc += lines.length
    funcs += (content.match(/function\s+|=>/g) || []).length
    complexity += (content.match(/if\s*\(|for\s*\(|while\s*\(|\?\s*\:/g) || []).length
  }
  const maintainability = Math.max(0.1, Math.min(1, 1 - complexity / Math.max(50, loc)))
  const cov = Math.max(0.2, Math.min(0.95, funcs / Math.max(10, loc / 20)))
  return { maintainability, complexity: Math.min(1, complexity / Math.max(10, funcs || 1)), coverage: cov }
}
