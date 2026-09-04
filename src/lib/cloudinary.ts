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
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('إعداد Cloudinary غير مكتمل (VITE_CLOUDINARY_CLOUD_NAME مفقود).')
  }
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('إعداد Cloudinary غير مكتمل (VITE_CLOUDINARY_UPLOAD_PRESET مفقود).')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`حجم الملف يتجاوز 10 ميجابايت (${(file.size / 1024 / 1024).toFixed(1)} MB).`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)

  let response: Response
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: formData }
    )
  } catch (e: any) {
    throw new Error('فشل الاتصال بـ Cloudinary. تحقق من اتصال الإنترنت وحاول مرة أخرى.')
  }

  if (!response.ok) {
    let detail = ''
    try {
      const errBody = await response.json()
      detail = errBody?.error?.message || ''
    } catch {}
    console.error('[cloudinary] upload failed', { status: response.status, detail, file: file.name })
    throw new Error(
      `فشل رفع الصورة (${response.status})${detail ? ': ' + detail : ''}. يمكنك استخدام "إضافة برابط" بدلاً من ذلك.`
    )
  }

  const data = await response.json()
  console.log('[cloudinary] upload success', { publicId: data.public_id, file: file.name })
  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    thumbnailUrl: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_400/${data.public_id}`,
    width: data.width || 0,
    height: data.height || 0,
  }
}
