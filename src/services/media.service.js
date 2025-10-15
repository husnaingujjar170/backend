const { uploadToCloudinary} = require('../lib/cloudinary');
const fs = require('fs').promises;

class MediaService {
    async processUpload(file) {
        if (!file) {
            return null;
        }

        try {
            const mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';
            
            const uploadResult = await uploadToCloudinary(
                file.path, 
                'social-media-posts', 
                mediaType
            );

            await this.cleanupTempFile(file.path);

            return {
                url: uploadResult.url,
                type: mediaType,
                filename: file.originalname,
                publicId: uploadResult.publicId,
                size: uploadResult.bytes
            };
        } catch (error) {
            await this.cleanupTempFile(file.path);
            throw new Error(`Media processing failed: ${error.message}`);
        }
    }


    async cleanupTempFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn(`Failed to cleanup temp file ${filePath}:`, error.message);
        }
    }

    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
        const maxSize = 50 * 1024 * 1024; 

        if (!allowedTypes.includes(file.mimetype)) {
            return {
                valid: false,
                message: 'Invalid file type. Only JPEG, PNG, GIF, WebP images and MP4, WebM, OGG videos are allowed.'
            };
        }

        if (file.size > maxSize) {
            return {
                valid: false,
                message: 'File too large. Maximum size is 50MB.'
            };
        }

        return { valid: true };
    }
}

module.exports = new MediaService();
