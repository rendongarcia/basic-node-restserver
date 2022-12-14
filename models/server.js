const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');
const fileUpload = require('express-fileupload');

class Server {
    constructor() {
        // config server
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

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

        // file uploads
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}...`)
        });
    }

}

module.exports = Server;