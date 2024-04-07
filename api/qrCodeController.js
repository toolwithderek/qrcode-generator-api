const generateQrCode = require('./../qrcode-generator.js')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const handleImageFileUpload = async (req, res) => {
    // Set up multer storage
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const subFolderName = `${year}-${month}-${day}`;
    if (!fs.existsSync(`./temp/${subFolderName}`)) {
        fs.mkdirSync(`./temp/${subFolderName}`, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./temp/${subFolderName}`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept image file
        } else {
            cb(new Error('File is not an image!'), false); // Reject non-image file
        }
    };
    
    // Define limits for file size
    const limits = {
        fileSize: 1024 * 1024 * 5 // 5MB limit for file size
    };
    const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits }).single('image');
    let uploadedFilePath = null;
    await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                reject(err);
            } else if (err) {
                reject(err);
            } else {
                // Assuming storage.destination returns the directory where the file is stored
                const filePath = req.file.path;
                resolve(filePath);
            }
        });
    }).then((filePath) => {
        // Send the file path back as a response
        clearTempFile(filePath);
        // res.status(200).json({ filePath });
        uploadedFilePath = filePath;
    }).catch((err) => {
        // res.status(500).json({ error: "Failed to upload image" });
    });
    return uploadedFilePath
}


function clearTempFile(filePath, timeOut = 60000 * 5) {
    setTimeout(() => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }, timeOut);
}

const getFilePath = (filePath) => {
    if (!filePath.startsWith('temp://')) {
        return filePath;
    }
    const correctFilePath = filePath.replace('temp://', 'temp/');
    // const file = fs.readFileSync(`./${correctFilePath}`);
    return `./${correctFilePath}`
}

exports.uploadImage = async (req, res) => {
    try {
        const uploadedFilePath = await handleImageFileUpload(req, res);
        if (!uploadedFilePath) {
            res.status(500).json({ error: 'Failed to upload image' });
            return;
        }
        const responseFilePath = uploadedFilePath.replace('temp/', 'temp://');
        res.status(200).json({ filePath: responseFilePath });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
}

exports.createQrCode = async (req, res) => {
    try {
        const data = req.body;
        let filePath = null;
        if (!data.image.startsWith('temp://')) {
            const response = await axios.get(data.image, { responseType: 'arraybuffer' });
            const fileName = `image_${Date.now()}`;
            filePath = `./temp/${fileName}`;
            fs.writeFileSync(filePath, response.data);
            data.image = filePath;
        }
        const qrCode = await generateQrCode(data, false);
        const responseData = {
            downloadUrl: qrCode.url,
            width: qrCode.width,
            height: qrCode.height,
            format: qrCode.format,
            created_at: qrCode.created_at,
            bytes: qrCode.bytes
        }
        clearTempFile(filePath, 0);
        if (responseData.downloadUrl) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(responseData.downloadUrl));
            res.setHeader('Content-Type', 'application/octet-stream');
            const fileStream = fs.createReadStream(responseData.downloadUrl);
            fileStream.pipe(res);
        } else {
            res.status(500).json({ error: 'Failed to generate QR code' });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
}
exports.createQrCodeV2 = async (req, res) => {
    try {
        const data = req.body;
        if (data.image) {
            data.image = getFilePath(data.image);
        }
        const qrCode = await generateQrCode(data, true);
        const responseData = {
            downloadUrl: qrCode.url,
            width: qrCode.width,
            height: qrCode.height,
            format: qrCode.format,
            created_at: qrCode.created_at,
            bytes: qrCode.bytes
        }
        if (responseData.downloadUrl) {
            res.status(200).json(responseData);
        } else {
            res.status(500).json({ error: 'Failed to generate QR code' });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
}
