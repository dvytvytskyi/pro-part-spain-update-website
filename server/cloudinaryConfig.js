const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgv0rxd60",
    api_key: process.env.CLOUDINARY_API_KEY || "949652851852698",
    api_secret: process.env.CLOUDINARY_API_SECRET || "G1rqbfM9Pkx0FdwfVVi3D4SudV4",
});

module.exports = cloudinary;
