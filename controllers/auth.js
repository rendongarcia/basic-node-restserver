const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
const user = require('../models/user');
const User = require('../models/user');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // verify if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'User / password are not valid!' // (email)
            });
        }

        // check if user is active
        if (!user.state) {
            return res.status(400).json({
                msg: 'User / password are not valid!' //  (state: false)
            });
        }

        // validate password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User / password are not valid!' //  (password)
            });
        }

        // Generate JSONWebToken
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'A server error has ocurred while signing in!'
        });
    }

}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, img_url, name } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        // if user doesn't exist, then create
        if (!user) {
            const data = {
                name,
                email,
                password: ':P_no_pass',
                img_url,
                google: true,
                role: 'USER_ROLE'
            };
            user = new User(data);
            await user.save();
        }

        // if user exists and is not active
        if (!user.state) {
            return res.status(401).json({
                msg: 'Forbidden'
            });
        }

        // if user exists, and google_auth = false, then enable
        if (!user.google) {
            await User.findByIdAndUpdate(user.id, { google_auth: true });
        }

        // if user exists, and google_auth = true, just log them
        // JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Error while signing in`
        })
    }

}

module.exports = {
    login, googleSignIn
}