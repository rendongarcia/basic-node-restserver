const { Router } = require('express');
const { check, query } = require('express-validator');
const { userGet
    , usersGet
    , userPut
    , userPost
    , userDelete } = require('../controllers/user');
const { isValidRole, emailExists, userExistsById, isValidUpdateRole } = require('../helpers/db-validators');
const { validatePassword } = require('../helpers/pwd-validator');
const { validateFields } = require('../middlewares/validate-fields');


const router = Router();

router.get('/', [
    query('limit').isNumeric().withMessage(`'limit' query param must be numeric`),
    query('from').isNumeric().withMessage(`'from' query param must be numeric`),
    validateFields
], usersGet);

router.get('/:id', [
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], userGet);

router.put('/:id', [
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidUpdateRole),
    check('password').custom((password) => validatePassword(password, true)),
    validateFields
], userPut);

router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password').custom(validatePassword),
    check('role').custom(isValidRole),
    check('email').custom(emailExists),
    validateFields
], userPost);

router.delete('/:id', [
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], userDelete);

module.exports = router;