const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const usersGet = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const qry = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(qry),
        User.find(qry)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total, users
    });
}

const userGet = async (req, res = response) => {

    const { id } = req.params;
    const userDB = await User.findById(id);

    res.json({
        userDB
    });

}

const userPost = async (req, res = response) => {

    const { name, password, email, role } = req.body;

    const user = new User({
        name, password: password.trim(), email, role
    });

    // Use bcrypt on password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password.trim(), salt);

    // save user
    await user.save();

    res.status(201).json({
        msg: 'Created new user',
        user
    });
}

const userPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google_auth, email, ...theUser } = req.body;

    // TODO: validate vs database
    if (password) {
        const salt = bcryptjs.genSaltSync();
        theUser.password = bcryptjs.hashSync(password.trim(), salt);
    }

    const userDB = await User.findByIdAndUpdate(id, theUser, { new: true });

    res.json({
        msg: 'Updated user',
        userDB
    });
}

const userDelete = async (req, res = response) => {
    const { id } = req.params;

    const userDB = await User.findByIdAndUpdate(id, { state: false }, { new: true })

    res.json({
        msg: 'deleted user',
        userDB
    });
}

module.exports = {
    usersGet
    , userGet
    , userPost
    , userPut
    , userDelete
}