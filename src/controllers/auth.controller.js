const {authService} = require('../services');
const {response} = require('../lib');
const {HTTP_STATUS, MESSAGES} = require('../constants')

class AuthController
{
    async register(req,res,next)
    {
      // 1. Get validated data from req.body (already validated by middleware)
      // 2. Call authService.register()
      // 3. Return success response with user + token
      console.log("I am here now boss\n");
        try {
        const userData=req.body;
        const result= await authService.register(userData);

        return response.success(
            res,
            result,
            MESSAGES.USER_CREATED,
            HTTP_STATUS.CREATED
        )
            
        } catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            const result = await authService.login(email, password);
            
            return response.success(
                res, 
                result, 
                MESSAGES.LOGIN_SUCCESS, 
                HTTP_STATUS.OK
            );
            
        } catch (error) {
            next(error);
        }
    }
    async getProfile(req,res,next)
    {
        try {
            const userId = req.user.id;
            const result= await authService.getProfile(userId);
            return response.success(
                res,
                result,
                MESSAGES.SUCCESS,
                HTTP_STATUS.OK
            );
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new AuthController();