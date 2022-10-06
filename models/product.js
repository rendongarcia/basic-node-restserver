const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    state: {
        type: Boolean,
        required: [true, 'State is required'],
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    description: {
        type: String,
        default: ''
    },
    available: {
        type: Boolean,
        default: true
    },
    img_url: {
        type: String
    }
});

ProductSchema.methods.toJSON = function () {
    const { __v, ...theProduct } = this.toObject();
    return theProduct;
}

module.exports = model('Product', ProductSchema);