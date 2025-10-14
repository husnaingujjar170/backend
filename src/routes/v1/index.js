const express = require('express');
const authRoutes = require('../auth.routes');
const postRoutes = require('../post.routes');
const commentRoutes = require('../comment.routes');
const likeRoutes = require('../like.routes'); 
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/', likeRoutes);



module.exports = router;