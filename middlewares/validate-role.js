const { response } = require('express');


const validateRole = async (req, res, next) => {

    // if authUser is not part of req, e.g. if validationRole comes first that validateJWT
    if (!req.authUser) {
        return res.status(500).json({
            msg: 'Not a valid path for this action'
        });
    }

    const { role, name } = req.authUser;

    // TODO: enhance role validation via database
    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'Forbidden action'
        })
    }

    next();

}

const checkRole = (...roles) => {
    return (req, res = response, next) => {

        // if authUser is not part of req, e.g. if validationRole comes first that validateJWT
        if (!req.authUser) {
            return res.status(500).json({
                msg: 'Not a valid path for this action'
            });
        }


        if (!roles.includes(req.authUser.role)) {
            return res.status(401).json({
                msg: 'Forbidden action'
            });
        }
        next();
    }
}

module.exports = {
    validateRole, checkRole
}