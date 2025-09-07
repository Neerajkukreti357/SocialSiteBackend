const express = require('express');
const { register, login } = require('../controllers/UsersController');
const ROUTES_CONSTANTS = require('../constants/routesConstants');

const router = express.Router();

router.post(ROUTES_CONSTANTS.register,  register);
router.post(ROUTES_CONSTANTS.login,  login);

module.exports = router;
