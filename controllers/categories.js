const { response } = require("express")
const { Category } = require('../models')

const createCategory = async (req, res = response) => {
    try {
        const name = req.body.name.toUpperCase().trim();
        const categoryDB = await Category.findOne({ name });
        if (categoryDB) {
            return res.status(400).json({
                msg: `Category '${name}' already exists`
            });
        }

        // user and state can be provided (accidentally or not) from front
        // so, it is better to be sure that they will have default values        
        const data = {
            name,
            user: req.authUser._id
        }

        const category = new Category(data);
        await category.save();

        res.status(201).json({
            msg: 'Category created',
            category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error while creating new category'
        });
    }
}

const getCategory = async (req, res = response) => {
    const { id } = req.params;
    const categoryDB = await Category.findById(id).populate('user', 'name');
    res.json({
        categoryDB
    })
}

const listCategories = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const qry = { state: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(qry),
        Category.find(qry)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('user', 'name')
    ])

    res.json({
        total, categories
    });
}

const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const { _id, user, ...theCategory } = req.body; //prevent overwrite _id 

    theCategory.name = theCategory.name.toUpperCase();
    const categoryCheck = await Category.findOne({ name: theCategory.name });

    // avoid throwing error if name is the same that updating category
    if (categoryCheck && id !== String(categoryCheck._id)) {
        return res.status(400).json({
            msg: `Category '${theCategory.name}' already exists`
        });
    }

    theCategory.user = req.authUser._id;

    // control truthy and falsy states, because state is not validated  
    if (theCategory.state !== null && theCategory.state !== undefined) {
        theCategory.state = theCategory.state ? true : false;
    }
    const categoryDB = await Category.findByIdAndUpdate(id, theCategory, { new: true }).populate('user', 'name');

    res.json({
        msg: 'updated category',
        categoryDB
    })

}

const deleteCategory = async (req, res = response) => {
    const { id } = req.params;
    const categoryDB = await Category.findByIdAndUpdate(id, { state: false }, { new: true });
    res.status(202).json({
        categoryDB
    });
}

module.exports = {
    createCategory,
    getCategory,
    listCategories,
    updateCategory,
    deleteCategory
}