const Router                = require('express').Router();
const { isAuth }            = require('../controllers/jwt.controller');
const AcitivityController   = require('../controllers/activity.controller');

Router.get('/:groupCode', isAuth, AcitivityController.get);


module.exports = Router;