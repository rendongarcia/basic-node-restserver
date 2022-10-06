const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const pwdValidator = require('./pwd-validator');
const uploadFiles = require('./upload-files');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...pwdValidator,
    ...uploadFiles
}