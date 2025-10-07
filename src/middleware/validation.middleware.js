const { response } = require('../lib');
const { HTTP_STATUS } = require('../constants');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return response.error(
        res, 
        'Validation failed', 
        HTTP_STATUS.BAD_REQUEST, 
        errors
      );
    }
    
    req.body = value;
    console.log("I am going next-> \n");
    next();
  };
};

module.exports = {
  validate
};