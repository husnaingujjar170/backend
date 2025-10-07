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

  extractUserId(token) {
    try {
      const decoded = this.verifyToken(token);
      return decoded.userId;
    } catch (error) {
      throw new Error('Unable to extract user ID from token');
    }
  }
}

module.exports = new TokenService();