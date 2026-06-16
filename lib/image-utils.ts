// Netlify Functions ont une limite de ~6 Mo sur le corps de la requête.
// On vise une taille bien en dessous pour laisser de la marge au reste du multipart.
export const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024

export async function compressImage(file: File): Promise<File> {
  // On ne compresse que les images. Les PDF (et autres) sont retournés tels quels.
  if (!file.type.startsWith('image/')) {
    return file
  }

  const img = await loadImage(file)
  if (!img) {
    // Impossible de décoder (HEIC non supporté, etc.) : on retourne l'original.
    return file
  }

  // Passes successives : on réduit d'abord la qualité, puis les dimensions,
  // jusqu'à passer sous la cible.
  const widthSteps = [2000, 1600, 1200, 1000]
  const qualitySteps = [0.85, 0.7, 0.55, 0.4]

  let best: File | null = null

  for (const maxWidth of widthSteps) {
    for (const quality of qualitySteps) {
      const candidate = await renderToJpeg(img, file.name, maxWidth, quality)
      if (!candidate) continue
      best = candidate
      if (candidate.size <= MAX_UPLOAD_BYTES) {
        return candidate
      }
    }
  }

  // Aucune passe n'a atteint la cible : on retourne la plus petite obtenue
  // (ou l'original si la compression a totalement échoué).
  return best ?? file
}

function loadImage(file: File): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onerror = () => resolve(null)
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function renderToJpeg(
  img: HTMLImageElement,
  originalName: string,
  maxWidth: number,
  quality: number
): Promise<File | null> {
  return new Promise((resolve) => {
    let width = img.width
    let height = img.height

    if (width > maxWidth) {
      height = Math.round((maxWidth / width) * height)
      width = maxWidth
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve(null)
      return
    }
    ctx.drawImage(img, 0, 0, width, height)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null)
          return
        }
        resolve(
          new File([blob], originalName.replace(/\.[^/.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
        )
      },
      'image/jpeg',
      quality
    )
  })
}

export function getThumbnailPreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result as string)
    }
  })
}
