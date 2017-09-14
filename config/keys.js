if (process.env.NODE_ENV === "production") {
  module.exports = require("./prodKeys.js");
} else {
  module.exports = require("./devKeys.js");
}
