const path = require('path');

module.exports = {
  // Other configurations...

  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify")
    }
  },

  // Other configurations...
};
