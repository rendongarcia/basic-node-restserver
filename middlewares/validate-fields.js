const { validationResult } = require('express-validator');

const validateFields = (req, res, next) => {

    const valErrors = validationResult(req);

    if (!valErrors.isEmpty()) {
        return res.status(400).json(valErrors);
    }

    next();
}

module.exports = {
    validateFields
}