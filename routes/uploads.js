const { Router } = require('express')
const { check, param } = require('express-validator');
const { uploadFile, updateFile, showImage, updateFileCloudinary, showImageCloudinary } = require('../controllers/uploads');
const { checkAllowedCollections } = require('../helpers');
const { validateFields, validateJWT, validateFileToUpload, getModel } = require('../middlewares');


const router = Router();

router.post('/', [
    validateJWT,
    validateFields,
    validateFileToUpload
], uploadFile);

router.put('/:collection/:id', [
    validateJWT,
    param('id', 'Not a valid Mongo Id').isMongoId(),
    param('collection').custom(col => checkAllowedCollections(col, ['users', 'products'])),
    getModel,
    validateFields,
    validateFileToUpload
], updateFileCloudinary)
//], updateFile)

router.get('/:collection/:id', [
    validateJWT,
    param('id', 'Not a valid Mongo Id').isMongoId(),
    param('collection').custom(col => checkAllowedCollections(col, ['users', 'products'])),
    getModel,
    validateFields
], showImageCloudinary)
//], showImage)
module.exports = router;