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
        // Check for command line arguments: node uploadImage.js <imagePathOrUrl> <publicId>
        const args = process.argv.slice(2);
        const inputSource = args[0];
        const targetPublicId = args[1];

        let source = inputSource;
        let publicId = targetPublicId || 'logo';
        let folder = 'spain-real-estate';

        if (!source) {
            // Default behavior if no args (backward compatibility or testing)
            source = path.join(__dirname, '..', 'logo.svg');
            console.log('No arguments provided. Using default logo path.');
        }

        console.log(`Uploading to Cloudinary...`);
        console.log(`Source: ${source}`);
        console.log(`Public ID: ${publicId}`);

        // If publicId contains slashes, we can extract folder, but Cloudinary handles 'folder/name' in public_id too or we can set folder explicitly.
        // Let's rely on public_id containing the folder if passed, or default to 'spain-real-estate' + public_id.
        // If the user passes "areas/hero", we can just pass that as public_id and rely on cloud config.

        const options = {
            folder: publicId.includes('/') ? undefined : folder, // If ID has folder, don't double folder
            public_id: publicId,
            overwrite: true,
            resource_type: 'auto' // auto detection
        };

        const result = await cloudinary.v2.uploader.upload(source, options);

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
