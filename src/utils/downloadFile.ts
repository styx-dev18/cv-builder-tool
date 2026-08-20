export function buildPdfFilename(title: string): string {
  const base = title.trim() || 'cv'
  return `${base.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 150)}.pdf`
}

export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
