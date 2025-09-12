const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
	cloud_name: 'dnmuqdtrl',
	api_key: '849746465838692',
	api_secret: 'cIEQSp8wZs6dGaHcvll6GhbGpu8'
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		return {
			folder: 'todotoday/profile_images',
			allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
			transformation: [{ width: 512, height: 512, crop: 'limit' }]
		};
	}
});

const upload = multer({ storage });

function uploadSingle(fieldName) {
	return upload.single(fieldName);
}

module.exports = { uploadSingle };
