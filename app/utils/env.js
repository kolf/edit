// Use singletons since this is only analyzed when the bundle is loaded, so
// no harm, which also allow us to export a literal instead of needing a func.
let isTest, isDev, isProd;

getEnvValues();
updateSingletonEnvValues();


function getEnvValues() {
  isTest = process && process.env.NODE_ENV === "test";
  isDev = process && process.env.NODE_ENV === "development";
  isProd = process && process.env.NODE_ENV === "production";
}

function updateSingletonEnvValues() {
  module.exports.isTest = isTest;
  module.exports.isTesting = isTest;
  module.exports.isDev = isDev;
  module.exports.isDevelopment = isDev;
  module.exports.isProd = isProd;
  module.exports.isProduction = isProd;
  
  module.exports.NODE_ENV = process.env.NODE_ENV;
}
