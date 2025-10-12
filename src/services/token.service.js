const { auth } = require('../lib');

class TokenService {
  generateAccessToken(payload) {
    return auth.jwt.generateToken(payload);
    
  }
  verifyToken(token) {
    try {
      return auth.jwt.verifyToken(token);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

}

module.exports = new TokenService();