/*
type : info, error, warnig
error : error object or message
response_code : 500, 400
*/
const handleError = function handleError(type, error, response_code) {
  console.log("ERROR", error);
  //Winston Log

  //Sentry Report If Error
};

module.exports.handleError = handleError;
