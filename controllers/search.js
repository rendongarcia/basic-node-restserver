const { response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
    'users', 'categories', 'products', 'roles'
];

const searchUsers = async (criteria = '', res = response) => {
    const isMongoId = ObjectId.isValid(criteria);

    if (isMongoId) {
        const user = await User.findById(criteria);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(criteria, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });
    res.json({
        results: users
    })
}

const searchCategories = async (criteria = '', res = response) => {
    const isMongoId = ObjectId.isValid(criteria);

    if (isMongoId) {
        const user = await Category.findById(criteria);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(criteria, 'i');

    const categories = await Category.find({ name: regex, state: true });
    res.json({
        results: categories
    })
}

const searchProducts = async (criteria = '', priceMin = 0, priceMax = Infinity, res = response) => {
    const isMongoId = ObjectId.isValid(criteria);

    if (isMongoId) {
        const user = await Product.findById(criteria).populate('category', 'name').populate('user', 'name');
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(criteria, 'i');

    /* TODO: condition for checking prices interval */
    /* $or: [{ name: regex }, { description: regex }],
        $and: [{ state: true }] 
        , { price: { $gte: priceMin } }, { price: { $lte: priceMax } }*/

    const products = await Product.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ state: true }]
    }).populate('category', 'name').populate('user', 'name');
    res.json({
        results: products
    })
}


const search = (req, res = response) => {
    const { collection, criteria } = req.params;
    const { pricemin = 0, pricemax = Infinity } = req.query;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Not a valid collection. Valid options: ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(criteria, res);
            break;

        case 'categories':
            searchCategories(criteria, res);
            break;

        case 'products':
            searchProducts(criteria, pricemin, pricemax, res);
            break;

        case 'roles':
            break;

        default:
            res.status(500).json({
                msg: 'Internal server error: Pending search'
            })
            break;
    }
}

module.exports = {
    search
}