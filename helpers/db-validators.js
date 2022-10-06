const { Role, User, Category, Product } = require('../models');

/* Role validations */

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

/* User validations */
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

/* Category validations */
const categoryExistsById = async (id = '') => {
    const existsDB = await Category.findById(id);
    if (!existsDB) {
        throw new Error(`Category id doesn't exist`);
    }
}

const categoryExistsByName = async (name = '') => {
    const existsDB = await Category.findOne({ name: name.toUpperCase() });
    if (!existsDB) {
        throw new Error(`Category '${name}' doesn't exist`);
    }
}

/* Product validations */
const productExistsById = async (id = '') => {
    const existsDB = await Product.findById(id);
    if (!existsDB) {
        throw new Error(`Product id doesn't exist`);
    }
}

/* Files validations */
const checkAllowedCollections = (collection = '', collections = []) => {
    if (!collections.includes(collection)) {
        throw new Error(`Collection ${collection} is not allowed. Options: ${collections}`)
    }
    return true;
}

module.exports = {
    isValidRole, emailExists, userExistsById, isValidUpdateRole, categoryExistsById, productExistsById, categoryExistsByName, checkAllowedCollections
}
