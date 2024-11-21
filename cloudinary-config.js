const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name : "dc1ofh0uj",
    api_key : "243944985143298",
    api_secret : "YceYlpFiWNGOZanyt-33_68xezg",
    secure : true
})

module.exports = cloudinary