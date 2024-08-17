const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const qrCodeController = require('./qrCodeController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config()
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(cors());

var options = {
  explorer: true
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.get('/api/healthCheck', (req, res) => {
  res.json({status: true});
});

app.post('/api/uploadImage', qrCodeController.uploadImage)
app.post('/api/createQrCode', qrCodeController.createQrCode)
// app.post('/api/createQrCodeV2', qrCodeController.createQrCodeV2)

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// Start the server
const appEnv = process.env.APP_ENV || 'development'
const port = process.env.SERVER_PORT || 3003;

if (appEnv !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });  
}
module.exports = app;
