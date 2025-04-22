const packageJson = require('../package.json');

module.exports = {
    NODE_ENV: '"production"',
    VERSION: JSON.stringify(packageJson.version)
};
