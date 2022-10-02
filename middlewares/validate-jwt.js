const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req, res = response, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Not valid authorization info provided'
        });
    }

    try {
        // extract uid from payload
        const { uid: authUid } = jwt.verify(token, process.env.SECRET_JWT_KEY);

        // get user that performs request
        const authUser = await User.findById(authUid);

        // prevent error if user doesn't exist
        if (!authUser) {
            return res.status(401).json({
                msg: 'Not valid authorization info provided'
            })
        }

        // verify if user state is true
        if (!authUser.state) {
            return res.status(401).json({
                msg: 'Not valid authorization info provided'
            });
        }

        // add user to request
        req.authUser = authUser;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Not valid authorization info provided'
        });
    }

}

module.exports = {
    validateJWT
}