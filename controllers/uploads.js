const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { uploadAFile } = require("../helpers");



const uploadFile = async (req, res = response) => {

    try {
        const filename = await uploadAFile(req.files, undefined, 'imgs');
        return res.json({
            filename
        });
    } catch (error) {
        console.log(error);
        if (String(error).startsWith(`File doesn't have a valid extension`)) {
            return res.status(400).json({
                msg: error
            });
        } else {
            return res.status(500).json({
                msg: 'Error while uploading file'
            })
        }
    }
}

const updateFile = async (req, res = response) => {

    const { collection } = req.params;
    const model = req.model;

    try {
        // Clean previous images
        if (model.img_url) {
            const imgPath = path.join(__dirname, '../uploads', collection, model.img_url);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        // Set new 
        model.img_url = await uploadAFile(req.files, undefined, collection);
        await model.save();
        return res.json({
            msg: `Updated image for ${collection} ${model.name}`,
            model
        });
    } catch (error) {
        console.log(error);
        if (String(error).startsWith(`File doesn't have a valid extension`)) {
            return res.status(400).json({
                msg: error
            });
        } else {
            return res.status(500).json({
                msg: 'Error while uploading file'
            })
        }
    }
}


const showImage = async (req, res = response) => {
    const { collection } = req.params;

    const model = req.model;
    try {
        // Clean previous images
        if (model.img_url) {
            const imgPath = path.join(__dirname, '../uploads', collection, model.img_url);
            if (fs.existsSync(imgPath)) {
                return res.sendFile(imgPath);
            }
        }

        const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(noImagePath);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error while getting file'
        });
    }
}


module.exports = {
    uploadFile, updateFile, showImage
}


/* const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `User id ${id} doesnt' exist`
                })
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Product id ${id} doesnt' exist`
                })
            }
            break;

        default:
            return res.status(501).json({
                msg: 'Not implemented'
            });
            break;
    }

    try {
        // Clean previous images
        if (model.img_url) {
            const imgPath = path.join(__dirname, '../uploads', collection, model.img_url);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        // Set new 
        model.img_url = await uploadAFile(req.files, undefined, collection);
        await model.save();
        return res.json({
            msg: `Updated image for ${collection} ${model.name}`,
            model
        });
    } catch (error) {
        console.log(error);
        if (String(error).startsWith(`File doesn't have a valid extension`)) {
            return res.status(400).json({
                msg: error
            });
        } else {
            return res.status(500).json({
                msg: 'Error while uploading file'
            })
        }
    } */