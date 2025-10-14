const { userRepository } = require('../repositories');
const { response } = require('../lib');
const { HTTP_STATUS } = require('../constants');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userRepository.findAll();
      
      const filteredUsers = users
        .filter(user => user.id !== req.user.id)
        .map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }));
      
      return response.success(
        res,
        { users: filteredUsers },
        'Users retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();