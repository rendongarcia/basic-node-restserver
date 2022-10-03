const { Router } = require('express')
const { check, query } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('email', 'Not a valid email').isEmail(),
    check('password', `Password can't be empty`).not().isEmpty(),
    validateFields
], login);

router.post('/google-auth', [
    check('id_token', 'ID Token required').not().isEmpty(),
    validateFields
], googleSignIn)

module.exports = router;