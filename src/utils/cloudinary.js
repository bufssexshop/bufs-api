import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadToCloudinary = (buffer) => {
  const folderName = process.env.CLOUDINARY_FOLDER || 'dev_products'

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { upload_preset: 'photos-products', folder: folderName },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    ).end(buffer)
  })
}

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId)
      await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from cloudinary: ', error)
  }
}

export default cloudinary
