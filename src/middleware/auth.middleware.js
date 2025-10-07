const {tokenService} = require('../services');
const { userRepository } = require('../repositories');
const { response } = require('../lib');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.error(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
      }
      const token = authHeader.substring(7); 

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
  const authorize = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return response.error(res, MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
      }
  
      next();
    };
  };
  
  module.exports = {
    authenticate,
    authorize
  };