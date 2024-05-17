const basicInfo = require('./basicInfo');
const components = require('./components');
const paths = require('./paths/index');

module.exports = {
    ...basicInfo,
    ...paths,
    ...components
};