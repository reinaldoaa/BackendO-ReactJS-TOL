const express = require('express');
const router = express.Router();
const {readRol,readRols,createRol,updateRol,deleteRol} = require('../controllers/rol.controller');
const auth = require('../middlewares/authMiddleware');

router
.get('/getRol/:id',auth,readRol)
.get('/getRols',auth,readRols)
.post('/createRol',auth,createRol)
.put('/updateRol',auth,updateRol)
.delete('/deleteRol',auth,deleteRol);

module.exports= router;