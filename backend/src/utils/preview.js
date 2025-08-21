export function preparePreview(files) {
  const hasServer = files.some((f) => /backend\//.test(f.path) || /server\.js$/.test(f.path))
  const hasStreamlit = files.some((f) => /streamlit/.test(f.path))
  let templateType = 'client-only'
  if (hasServer) templateType = 'full-stack'
  if (hasStreamlit) templateType = 'streamlit'
  return { templateType }
}
