
const errorHandlerMiddleware = (error, req, res, next) => {
 

    switch (error.name) {
      case 'SequelizeValidationError':
        res.status(400).send({ status: 400, message: error.errors[0].message });
        break;
      case 'SequelizeDatabaseError':
          res.status(400).send({ status: 400, message: error.errors[0].message });
        break;
      case 'SequelizeUniqueConstraintError':
          res.status(400).send({ status: 400, message: error.errors[0].message });
        break;
      case 'Error':
          res.status(400).send({ status: 400, message: error.message });
        break;
      default:
          res.status(500).send({ status: 500, message: "Internal Server Errorr!" });
        break;
    }
  };
  
  module.exports = {errorHandlerMiddleware};