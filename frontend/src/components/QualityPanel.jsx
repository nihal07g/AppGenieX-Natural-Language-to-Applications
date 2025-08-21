export default function QualityPanel({ quality }) {
  const q = quality || { maintainability: 70, complexity: 3, coverage: 50 }
  const pct = (v) => (v <= 1 ? Math.round(v * 100) : Math.round(v))
  const items = [
    { key: 'maintainability', label: 'Maintainability', value: pct(q.maintainability) },
    { key: 'complexity', label: 'Complexity', value: q.complexity },
    { key: 'coverage', label: 'Coverage', value: pct(q.coverage) },
  ]
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Quality</h3>
      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.key}>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{m.label}</span>
              <span>{m.key === 'complexity' ? m.value : `${m.value}%`}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className={`h-full ${m.key === 'complexity' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, m.key === 'complexity' ? Math.min(100, m.value * 10) : m.value)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
