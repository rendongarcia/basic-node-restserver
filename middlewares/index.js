const valFields = require('./validate-fields');
const valJWT = require('./validate-jwt');
const valRole = require('./validate-role');

module.exports = {
    ...valFields,
    ...valJWT,
    ...valRole
}