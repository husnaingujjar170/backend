const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<Object>} Upload result
 */
const uploadToCloudinary = async (filePath, folder = 'social-media-posts', resourceType = 'auto') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: resourceType,
            transformation: resourceType === 'image' ? [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ] : [
                { width: 1280, height: 720, crop: 'limit' },
                { quality: 'auto' }
            ]
        });
        
        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
            bytes: result.bytes
        };
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<Object>} Deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary
};
