const generateQrCode = require('./../qrcode-generator.js')

exports.createQrCode = async (req, res) => {
    try {
        const data = req.body;
        const qrCode = await generateQrCode(data, true);
        const responseData = {
            downloadUrl: qrCode.url,
            width: qrCode.width,
            height: qrCode.height,
            format: qrCode.format,
            created_at: qrCode.created_at,
            bytes: qrCode.bytes
        }
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
}
