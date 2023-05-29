var express = require('express');
var router = express.Router();
const axios = require('axios');

const {LocalStorage} = require("node-localstorage");
 var localStorage = new LocalStorage('./scratch'); 


var {
    access_Token
} = require('./auth');
var fetch = require('../fetch');

var { GRAPH_ME_ENDPOINT,userId } = require('../authConfig');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.get('/id',
    isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
    }
);

router.get('/messages',
 // check if user is authenticated
 function (req, res, next) {
    res.send('Hello world');
    
}
); 



module.exports = router;
