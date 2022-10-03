const { Router } = require('express');
const { check, query } = require('express-validator');
const { createProduct, listProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/products');
const { productExistsById, categoryExistsByName } = require('../helpers/db-validators');

const { validateFields, validateJWT, validateRole, checkRole } = require('../middlewares');

const router = Router();

// get all products - paginated
router.get('/', [
    validateJWT,
    query('limit').isNumeric().withMessage(`'limit' query param must be numeric`),
    query('from').isNumeric().withMessage(`'from' query param must be numeric`),
    validateFields
], listProducts);

// get one product
router.get('/:id', [
    validateJWT,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], getProduct);

// update one product
router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(productExistsById),
    check('name', `Product name can't be empty`).not().isEmpty(),
    check('description', 'Description must be a String').optional().isString(),
    check('available', 'Available must be a boolean').optional().isBoolean(),
    check('price', 'Price must be numeric and greater than 0').optional().isNumeric({ min: 0 }),
    check('category', 'Category must be sent').not().isEmpty(),
    check('category').custom(categoryExistsByName),
    validateFields
], updateProduct);

// create new product
router.post('/', [
    validateJWT,
    checkRole('ADMIN_ROLE'),
    check('name', `Product name can't be empty`).not().isEmpty(),
    check('description', 'Description must be a String').optional().isString(),
    check('available', 'Available must be a boolean').optional().isBoolean(),
    check('price', 'Price must be numeric and greater than 0').optional().isNumeric({ min: 0 }),
    check('category', 'Category must be sent').not().isEmpty(),
    validateFields,
    check('category').custom(categoryExistsByName),
    validateFields
], createProduct);

// delete one product - admin
router.delete('/:id', [
    validateJWT,
    checkRole('ADMIN_ROLE'),
    check('id', 'Not a valid Mongo Id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], deleteProduct);


module.exports = router;