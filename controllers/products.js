const { response } = require("express")
const { Product, Category } = require('../models')

const createProduct = async (req, res = response) => {

    try {
        const name = req.body.name.toUpperCase().trim();
        const { description = '', available = true, price = 0, category } = req.body;

        const productDB = await Product.findOne({ name });
        if (productDB) {
            return res.status(400).json({
                msg: `Product '${name}' already exists`
            });
        }

        // user and state can be provided (accidentally or not) from front
        // so, it is better to be sure that they will have default values
        const data = {
            name,
            description,
            available,
            price,
            user: req.authUser._id
        }

        const categoryDB = await Category.findOne({ name: category.toUpperCase() });
        data.category = categoryDB._id;

        const product = new Product(data);
        await product.save();

        res.status(201).json({
            msg: 'Product created',
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error while creating new product'
        });
    }
}


const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { _id, user, category, ...theProduct } = req.body; //prevent overwrite _id 

    theProduct.name = theProduct.name.toUpperCase();
    const productCheck = await Product.findOne({ name: theProduct.name });

    // avoid throwing error if name is the same that updating product
    if (productCheck && id !== String(productCheck._id)) {
        return res.status(400).json({
            msg: `Product '${theProduct.name}' already exists`
        });
    }

    theProduct.user = req.authUser._id;

    // control truthy and falsy states, because state is not validated  
    if (theProduct.state !== null && theProduct.state !== undefined) {
        theProduct.state = theProduct.state ? true : false;
    }

    if (theProduct.available !== null && theProduct.available !== undefined) {
        theProduct.available = theProduct.available ? true : false;
    }

    const categoryDB = await Category.findOne({ name: category.toUpperCase() });
    theProduct.category = categoryDB._id;

    const productDB = await Product.findByIdAndUpdate(id, theProduct, { new: true }).populate('user', 'name').populate('category', 'name');

    res.json({
        msg: 'updated product',
        productDB
    })

}

const getProduct = async (req, res = response) => {
    const { id } = req.params;
    const productDB = await Product.findById(id).populate('user', 'name').populate('category', 'name');
    res.json({
        productDB
    })
}

const listProducts = async (req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const qry = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(qry),
        Product.find(qry)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('user', 'name')
            .populate('category', 'name')
    ])

    res.json({
        total, products
    });
}

const deleteProduct = async (req, res = response) => {
    const { id } = req.params;
    const productDB = await Product.findByIdAndUpdate(id, { state: false }, { new: true });
    res.status(202).json({
        productDB
    });
}

module.exports = {
    createProduct,
    getProduct,
    listProducts,
    updateProduct,
    deleteProduct
}