const express = require('express');
const {validate,authenticate} =require('../middleware')
const {auth: authSchemas} = require('../lib/validation');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register',
    validate(authSchemas.registerSchema),
    authController.register
);

router.post('/login',
    validate(authSchemas.loginSchema),
    authController.login
);

router.get('/profile', 
    authenticate,                         
    authController.getProfile            
  );
router.post('/logout', authController.logout);
  
module.exports = router;