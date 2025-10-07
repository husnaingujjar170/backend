const {HTTP_STATUS, MESSAGES} = require('../../constants');

const success=(res,data=null, message= MESSAGES.SUCCESS, statusCode=HTTP_STATUS.OK)=>
{
    console.log("testing");
    return res.status(statusCode).json(
        {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        }
    );
};
const error=(res,message='Something went wrong',statusCode= HTTP_STATUS.INTERNAL_SERVER_ERROR,errors=null)=>
{
    return res.status(statusCode).json(
        {
            success:false,
            message,
            errors,
            timestamp: new Date().toISOString()
        }
    );
}
module.exports={
    success,
    error
};