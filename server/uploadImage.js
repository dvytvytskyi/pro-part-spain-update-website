import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgv0rxd60",
    api_key: process.env.CLOUDINARY_API_KEY || "949652851852698",
    api_secret: process.env.CLOUDINARY_API_SECRET || "G1rqbfM9Pkx0FdwfVVi3D4SudV4",
});

async function uploadImage() {
    try {
        const imagePath = path.join(__dirname, '..', 'logo.svg');

        console.log('Uploading logo to Cloudinary...');
        console.log('Image path:', imagePath);

        const result = await cloudinary.v2.uploader.upload(imagePath, {
            folder: 'spain-real-estate',
            public_id: 'logo',
            overwrite: true,
            resource_type: 'image'
        });

        console.log('✅ Image uploaded successfully!');
        console.log('URL:', result.secure_url);
        console.log('Public ID:', result.public_id);

        return result;
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        throw error;
    }
}

uploadImage();
