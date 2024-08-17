const { QRCodeCanvas } = require('@loskir/styled-qr-code-node'); // or CommonJS
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const generateData = require('./canvasData');

const folderName = 'QrCode';
dotenv.config()

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadImage = async (imagePath) => {
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
    const downloadOptions = data.downloadOptions || {}
    const canvas = generateData(data)
    const qrCode = new QRCodeCanvas(canvas);
    const currentDate = new Date();
    if (!fs.existsSync(`./temp`)) {
        fs.mkdirSync(`./temp`, { recursive: true });
    }
    const outputFileName = `./temp/qrcode_generated_${currentDate.getTime()}.${downloadOptions.extension || 'png'}`;;
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
