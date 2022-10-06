const { response } = require("express");

const validateFileToUpload = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No files were sent to upload'
        });
    }

    // just for clarity, a second validation to check if req.files.file was sent
    // this is because we are expecting a single file named "file"
    if (!req.files.file) {
        return res.status(400).json({
            msg: 'No files were sent to upload'
        });
    }

    next();
}

module.exports = {
    validateFileToUpload
}

