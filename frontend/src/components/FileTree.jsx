export default function FileTree({ files }) {
  if (!files?.length) {
    return (
      <div className="card p-4 text-gray-500">Generated files will appear here.</div>
    )
  }
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-2">Files</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        {files.map((f) => (
          <li key={f.path} className="font-mono">
            {f.path}
          </li>
        ))}
      </ul>
    </div>
  )
}
