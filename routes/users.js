const { Router } = require('express');
const { check, query } = require('express-validator');
const { getUser
    , listUsers
    , updateUser
    , createUser
    , deleteUser } = require('../controllers/users');
const { isValidRole, emailExists, userExistsById, isValidUpdateRole } = require('../helpers/db-validators');
const { validatePassword } = require('../helpers/pwd-validator');

const { validateFields, validateJWT, validateRole, checkRole } = require('../middlewares')


const router = Router();

router.get('/', [
    validateJWT,
    query('limit').isNumeric().withMessage(`'limit' query param must be numeric`),
    query('from').isNumeric().withMessage(`'from' query param must be numeric`),
    validateFields
], listUsers);

router.get('/:id', [
    validateJWT,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], getUser);

router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidUpdateRole),
    check('password').custom((password) => validatePassword(password, true)),
    validateFields
], updateUser);

router.post('/', [
    validateJWT,
    checkRole('ADMIN_ROLE'),
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password').custom((password) => validatePassword(password, false)),
    check('role').custom(isValidRole),
    check('email').custom(emailExists),
    validateFields
], createUser);

router.delete('/:id', [
    validateJWT,
    checkRole('ADMIN_ROLE', 'SUPER_ROLE'),
    //validateRole,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], deleteUser);

module.exports = router;