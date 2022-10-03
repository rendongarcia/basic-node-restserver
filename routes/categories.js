const { Router } = require('express');
const { check, query } = require('express-validator');
const { createCategory, listCategories, getCategory, deleteCategory, updateCategory } = require('../controllers/categories');
const { categoryExistsById } = require('../helpers/db-validators');

const { validateFields, validateJWT, validateRole, checkRole } = require('../middlewares');

const router = Router();

// get all categories - paginated
router.get('/', [
    validateJWT,
    query('limit').isNumeric().withMessage(`'limit' query param must be numeric`),
    query('from').isNumeric().withMessage(`'from' query param must be numeric`),
    validateFields
], listCategories);

// get one category
router.get('/:id', [
    validateJWT,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], getCategory);

// update one category
router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(categoryExistsById),
    check('name', `Category name can't be empty`).not().isEmpty(),
    validateFields
], updateCategory);

// create new category
router.post('/', [
    validateJWT,
    checkRole('ADMIN_ROLE'),
    check('name', `Category name can't be empty`).not().isEmpty(),
    validateFields
], createCategory);

// delete one category - admin
router.delete('/:id', [
    validateJWT,
    checkRole('ADMIN_ROLE'),
    check('id', 'Not a valid Mongo Id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], deleteCategory);


module.exports = router;