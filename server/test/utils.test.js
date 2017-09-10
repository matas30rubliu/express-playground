var expect = require('expect');

var utils = require('../utils.js');

describe('constructMessage', () => {
  it('Should return message object', () => {
    var fromTest = "Matas";
    var messageTest = "This is a test message";
    var generatedMessage = utils.constructMessage(fromTest, messageTest);

    expect(generatedMessage).toInclude({
      from: fromTest,
      message: messageTest
    });

  });
});
