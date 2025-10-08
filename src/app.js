const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');
const { logger } = require('./lib/logger');
const { errorHandler, notFound } = require('./middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(logger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Social Media API - Private Platform',
    version: '1.0.0',
    note: 'All content requires authentication. Please login to access posts and comments.',
    endpoints: {
      health: 'GET /api/health (public)',
      
      register: 'POST /api/v1/auth/register (public)',
      login: 'POST /api/v1/auth/login (public)',
      
      profile: 'GET /api/v1/auth/profile (protected)',
      getAllPosts: 'GET /api/v1/posts (protected)',
      createPost: 'POST /api/v1/posts (protected)',
      getPost: 'GET /api/v1/posts/:postId (protected)',
      getUserPosts: 'GET /api/v1/posts/user/my-posts (protected)',
      updatePost: 'PUT /api/v1/posts/:postId (protected, owner only)',
      deletePost: 'DELETE /api/v1/posts/:postId (protected, owner only)',
      getComments: 'GET /api/v1/comments/post/:postId (protected)',
      addComment: 'POST /api/v1/comments/post/:postId (protected)',
      updateComment: 'PUT /api/v1/comments/:commentId (protected, owner only)',
      deleteComment: 'DELETE /api/v1/comments/:commentId (protected, owner only)'
    },
    authRequired: 'Include "Authorization: Bearer <your_jwt_token>" header for protected routes'
  });
});

app.use(notFound);

app.use(errorHandler);
module.exports = app;