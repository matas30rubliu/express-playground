var constructMessage = (from, message) => {
  var constructedMessage = {
    from,
    message,
    createdAt: new Date().getTime()
  };
  return constructedMessage;
};

module.exports = {
  constructMessage
};
