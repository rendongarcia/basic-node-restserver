const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGODB_CNN);

        console.log('Connected to database');
    } catch (err) {
        console.log(error);
        throw new Error('Error trying to connect to the database');
    }
}

module.exports = {
    dbConnection
}