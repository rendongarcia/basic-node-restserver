const { User, Product } = require("../models");

const getModel = async (req, res, next) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `User id ${id} doesnt' exist`
                })
            }
            req.model = model;
            next();
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Product id ${id} doesnt' exist`
                })
            }
            req.model = model;
            next();
            break;

        default:
            return res.status(501).json({
                msg: 'Not implemented'
            });
            break;
    }

}

module.exports = {
    getModel
}