const valFields = require('./validate-fields');
const valJWT = require('./validate-jwt');
const valRole = require('./validate-role');
const valFile = require('./check-file')
const getModel = require('./get-model')

module.exports = {
    ...valFields,
    ...valJWT,
    ...valRole,
    ...valFile,
    ...getModel
}