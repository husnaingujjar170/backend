const express = require('express');
const authRoutes = require('../auth.routes');

const router = express.Router();

// All v1 routes
router.use('/auth', authRoutes);

// Future routes can be added here:
// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

module.exports = router;