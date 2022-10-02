const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
    return new Promise((res, rej) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRET_JWT_KEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                rej(`JSON web token couldn't be generated!`)
            } else {
                res(token);
            }
        })
    });
}

module.exports = {
    generateJWT
}