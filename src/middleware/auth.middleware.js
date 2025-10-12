const { tokenService } = require('../services');
const { userRepository } = require('../repositories');
const { response } = require('../lib');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return response.error(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = tokenService.verifyToken(token);

    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      return response.error(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = user;
    next();

  } catch (error) {
    return response.error(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
};

module.exports = {
  authenticate
};