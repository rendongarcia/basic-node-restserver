const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {
    constructor() {
        // config server
        this.app = express();
        this.port = process.env.PORT;

        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

        //connect to database
        this.connectDB();

        // middlewares
        this.middlewares();

        // routes
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // cors
        this.app.use(cors());

        // Parse and read body
        this.app.use(express.json());

        // public folder
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usersPath, require('../routes/users'));
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}...`)
        });
    }

}

module.exports = Server;