const {QRCodeCanvas} = require('@loskir/styled-qr-code-node'); // or CommonJS
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');

const folderName = 'QrCode';
dotenv.config()

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Log the configuration
// console.log(cloudinary.config());

/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const subFolderName = `${year}-${month}-${day}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3)
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: folderName + '/' + subFolderName,
      expires_at: expirationDate
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result;
    } catch (error) {
      console.error(error);
    }
};

function clearTempFile(filePath) {
    setTimeout(() => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }, 60000);
}


async function generateQrCode(data = {}, isUpload = false) {
    // const data = {
    //     "data": "https:smarttrick.org",
    //     "width": 300,
    //     "height": 300,
    //     "image": "https://qr-code-styling.com/0b3922d9d1e466270a79706c08c4a57c.png",
    //     "dotsOptions": {
    //         "color": "#5ab342",
    //         "type": "square"
    //     },
    //     "cornersSquareOptions": {
    //         "color": "#57a805",
    //         "type": "square"
    //     },
    //     "cornersDotOptions": {
    //         "color": "#14761a",
    //         "type": "square"
    //     },
    //     "backgroundOptions": {
    //         "color": "#ffffff"
    //     },
    //     "imageOptions": {
    //         "hideBackgroundDots": false,
    //         "imageSize": 0.4,
    //         "margin": 0
    //     },
    //     "downloadOptions": {
    //         "name": "qrcode_generated.png",
    //         "extension": "png"
    //     }
    // }
    const dotsOptions = data.dotsOptions || {}
    const cornersSquareOptions = data.cornersSquareOptions || {}
    const backgroundOptions = data.backgroundOptions || {}
    const cornersDotOptions = data.cornersDotOptions || {}
    const imageOptions = data.imageOptions || {}
    const downloadOptions = data.downloadOptions || {}
    const qrCode = new QRCodeCanvas({
        width: data.width || 300,
        height: data.height || 300,
        data: data.data || "https://qrcode.smarttrick.org",
        image: data.image,
        dotsOptions: {
            color: dotsOptions.color || "#4267b2",
            type: dotsOptions.type || 'square',
        },
        cornersSquareOptions: {
            color: cornersSquareOptions.color || "#4267b2",
            type: cornersSquareOptions.type || 'square',
        },
        cornersDotOptions: {
            color: cornersDotOptions.color || "#4267b2",
            type: cornersDotOptions.type || 'square',
        },
        backgroundOptions: {
            color: backgroundOptions.color || "#ffffff",
        },
        imageOptions: {
            hideBackgroundDots: imageOptions.hideBackgroundDots,
            imageSize: imageOptions.imageSize,
            crossOrigin: "anonymous",
            margin: imageOptions.margin,
        },
    });
    const currentDate = new Date();
    if (!fs.existsSync(`./temp`)) {
        fs.mkdirSync(`./temp`, { recursive: true });
    }
    const outputFileName = `./temp/qrcode_generated_${currentDate.getTime()}.${downloadOptions.extension || 'png'}`;
    await qrCode.toFile(outputFileName, downloadOptions.extension || 'png');
    clearTempFile(outputFileName);
    if (isUpload) {
        const uploadResult = await uploadImage(outputFileName)
        return uploadResult;
    } else {
        return {
            url: outputFileName
        };
    }
}

module.exports = generateQrCode;
