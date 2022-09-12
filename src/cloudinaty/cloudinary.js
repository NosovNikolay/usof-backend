import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from 'fastify-multer'

cloudinary.config({
    cloud_name: 'dsgubyha5',
    api_key: '692315237392831',
    api_secret: 'GCoa0_c0Je5kxfw1UPSfk4BDsHg',
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'usof',
        allowedFormats: [ 'jpg', 'png' ],
        transformation: [ { width: 800, height: 800, crop: 'limit' } ]
    }
});

const parser = multer({ storage });

export async function cloudinaryDecorate(fastify, opts, done) {
    fastify.decorate('multer', { parser });
    done()
}
