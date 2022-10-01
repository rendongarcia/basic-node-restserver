const { response } = require('express');


const userGet = (req, res = response) => {
    const { q = null, name = 'No name', apikey = '' } = req.query;

    res.json({
        msg: 'get API',
        q,
        name,
        apikey
    });
}

const userPost = (req, res = response) => {
    const { name, age } = req.body;

    res.json({
        msg: 'post API',
        name,
        age
    });
}

const userPut = (req, res = response) => {
    const { id } = req.params;

    res.json({
        msg: 'update API',
        id
    });
}

const userDelete = (req, res = response) => {
    res.json({
        msg: 'delete API'
    });
}

module.exports = {
    userGet
    , userPost
    , userPut
    , userDelete
}