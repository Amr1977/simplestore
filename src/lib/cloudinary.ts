export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export function getCloudinaryUrl(publicId: string, options: Record<string, string> = {}): string {
  const { width = 'auto', format = 'auto', quality = 'auto', ...rest } = options
  const transforms = `f_${format},q_${quality},w_${width}${Object.entries(rest).map(([k, v]) => `,${k}_${v}`).join('')}`
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

export function getThumbnailUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_400/${publicId}`
}

export async function uploadToCloudinary(file: File, folder: string): Promise<{
  publicId: string
  secureUrl: string
  thumbnailUrl: string
  width: number
  height: number
}> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) throw new Error('Upload failed')
  const data = await response.json()
  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    thumbnailUrl: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_400/${data.public_id}`,
    width: data.width,
    height: data.height,
  }
}
