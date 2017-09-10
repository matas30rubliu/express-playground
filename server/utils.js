// https://momentjs.com/docs/#/displaying/
var moment = require('moment');

var constructMessage = (from, message) => {
  var constructedMessage = {
    from,
    message,
    createdAt: moment().format('HH:mm:ss')
  };
  return constructedMessage;
};

module.exports = {
  constructMessage
};
