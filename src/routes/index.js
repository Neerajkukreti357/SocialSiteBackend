const express = require('express');
const router = express.Router();

const userRoutes = require('./UserRoutes.js');
const uploadsRoutes = require("./Uploads.js")

router.use('/users', userRoutes);
router.use('/uploads', uploadsRoutes);

module.exports = router;
