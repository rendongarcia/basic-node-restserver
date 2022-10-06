const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const { response } = require("express");
const { uploadAFile, urlExistNodeJS } = require("../helpers");

cloudinary.config(process.env.CLOUDINARY_URL);


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

const updateFileCloudinary = async (req, res = response) => {

    const { collection } = req.params;
    const model = req.model;

    try {
        // Clean previous images
        if (model.img_url) {
            const nameArr = model.img_url.split('/');
            const nameImg = nameArr[nameArr.length - 1]
            const [public_id, ext] = nameImg.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        // Set new 
        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
        model.img_url = secure_url;

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


const showImageCloudinary = async (req, res = response) => {

    const model = req.model;
    try {
        if (model.img_url) {
            return res.json({
                url: model.img_url
            })
            /* const exists = await urlExistNodeJS(model.img_url);
            if (exists) {
                return res.redirect(model.img_url);
            } */
        }

        /* const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(noImagePath); */
        return res.json({
            url: 'no-image'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error while getting file'
        });
    }
}


module.exports = {
    uploadFile, updateFile, showImage, updateFileCloudinary, showImageCloudinary
}

