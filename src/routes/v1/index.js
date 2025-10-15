const express = require('express');
const authRoutes = require('../auth.routes');
const postRoutes = require('../post.routes');
const commentRoutes = require('../comment.routes');
const likeRoutes = require('../like.routes'); 
const userRoutes = require('../user.routes');
const followRoutes = require('../follow.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/', likeRoutes);
router.use('/users', userRoutes);
router.use('/users', followRoutes);

module.exports = router;