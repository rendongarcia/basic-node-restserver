
const validatePassword = (password = '', updatePass = false) => {

    if (updatePass && password === '') {
        return true;
    }

    if (typeof password !== 'string') {
        throw new Error('Password must be a string');
    }

    if (password.length < 8 || password.length > 100) {
        throw new Error('Password length must be between 8 and 100');
    }

    if (/^[a-zA-Z]*$/.test(password)) {
        throw new Error('Password must contains at least 1 number');
    }

    if (/^[0-9]*$/.test(password)) {
        throw new Error('Password must contains at least 1 alphanumeric character');
    }

    if (password.toUpperCase() === password) {
        throw new Error('Password must contains at least 1 lowercase letter');
    }

    if (password.toLowerCase() === password) {
        throw new Error('Password must contains at least 1 uppercase letter');
    }

    return true;
}

module.exports = {
    validatePassword
}