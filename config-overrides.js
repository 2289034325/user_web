const { override, addDecoratorsLegacy,addLessLoader } = require('customize-cra');

// Adds legacy decorator support to the Webpack configuration.
module.exports = override(addDecoratorsLegacy(),
    addLessLoader({javascriptEnabled: true}));