const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

const qrCodeController = require('./qrCodeController');

dotenv.config()
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(cors());

app.get('/api/healthcheck', (req, res) => {
  res.json({status: true});
});

app.post('/api/qr-code', qrCodeController.createQrCode)

// Start the server
const appEnv = process.env.APP_ENV || 'development'
const port = process.env.SERVER_PORT || 3003;

if (appEnv !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });  
}
module.exports = app;
