const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        // config server
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/user';

        // middlewares
        this.middlewares();

        // routes
        this.routes();
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
        this.app.use(this.usersPath, require('../routes/user'));
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}...`)
        });
    }

}

module.exports = Server;