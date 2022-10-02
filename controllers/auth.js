const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generateJWT } = require('../helpers/generate-jwt');
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

module.exports = {
    login
}