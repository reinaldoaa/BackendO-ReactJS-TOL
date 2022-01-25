const express = require('express');
const router = express.Router();
const {login,register,authenticate,readUsers} = require('../controllers/user.controller')
const auth = require('../middlewares/authMiddleware');

router
.get('/authenticate',authenticate)
.post('/login',login)
.post('/register',register)
.get('/getUsers',auth,readUsers)

module.exports= router;
