const express = require('express');
const router = express.Router();
const { followController } = require('../controllers');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:userId/follow', authenticate, followController.followUser);
router.delete('/:userId/unfollow', authenticate, followController.unfollowUser);

router.get('/:userId/followers', authenticate, followController.getFollowers);
router.get('/:userId/following', authenticate, followController.getFollowing);

router.get('/:userId/is-following', authenticate, followController.checkIsFollowing);

router.get('/:userId/stats', authenticate, followController.getFollowStats);

module.exports = router;
