const { Router } = require('express')
const { check, query } = require('express-validator');
const { login } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'Not a valid email').isEmail(),
    check('password', `Password can't be empty`).not().isEmpty(),
    validateFields
], login);

module.exports = router;