const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadAFile = (files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((res, rej) => {
        const { file } = files;
        const cuttedName = file.name.split('.');
        const ext = String(cuttedName[cuttedName.length - 1]).toLowerCase();

        // check extension
        if (!allowedExtensions.includes(ext)) {
            return rej(`File doesn't have a valid extension. Valid: ${allowedExtensions}`);
        }

        const tempName = `${uuidv4()}.${ext}`;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);
        //console.log(uploadFile);

        file.mv(uploadPath, (err) => {
            if (err) {
                rej(err);
            }
            res(tempName);
        });
    });

}

module.exports = {
    uploadAFile
}