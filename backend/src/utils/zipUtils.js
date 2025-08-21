import AdmZip from 'adm-zip'

export async function createZipBuffer(files) {
  const zip = new AdmZip()
  for (const f of files) {
    const path = f.path.replace(/^\/+/, '')
    const content = typeof f.content === 'string' ? f.content : JSON.stringify(f.content, null, 2)
    zip.addFile(path, Buffer.from(content, 'utf8'))
  }
  return zip.toBuffer()
}
