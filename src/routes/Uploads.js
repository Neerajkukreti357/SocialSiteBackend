const express = require('express');
const { uploadImage } = require('../controllers/Uploads');
const uploadMiddleware = require('../middlewares/UploadsMiddlewares');
const ROUTES_CONSTANTS = require('../constants/routesConstants');

const router = express.Router();

router.post(ROUTES_CONSTANTS.profilePhotos,uploadMiddleware,uploadImage);

module.exports = router;
