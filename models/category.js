const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
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
    }
});

CategorySchema.methods.toJSON = function () {
    const { __v, ...theCategory } = this.toObject();
    return theCategory;
}

module.exports = model('Category', CategorySchema, 'categories');