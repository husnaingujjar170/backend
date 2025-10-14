const express = require('express');
const { authenticate } = require('../middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', userController.getAllUsers);

module.exports = router;