const Role = require('../models/role');
const User = require('../models/user');

const isValidUpdateRole = async (role = '') => {
    if (role !== '') {
        const roleExists = await Role.findOne({ role });
        if (!roleExists) {
            throw new Error(`Role '${role}' is not valid!`)
        }
    }
}

const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`Role '${role}' is not valid!`)
    }
}

const emailExists = async (email = '') => {
    const existsDB = await User.findOne({ email });
    if (existsDB) {
        throw new Error('Email is already registered!');
    }
}

const userExistsById = async (id = '') => {
    const existsDB = await User.findById(id);
    if (!existsDB) {
        throw new Error(`User id doesn't exist!`);
    }
}

module.exports = {
    isValidRole, emailExists, userExistsById, isValidUpdateRole
}