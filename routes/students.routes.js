const StudentController = require('../controllers/student.controller');
const Router            = require('express').Router();
const { isAuth } = require('../controllers/jwt.controller');


Router.get('/groups', isAuth, StudentController.Auth, StudentController.getGroups);
Router.post('/excuse', isAuth, StudentController.Auth, StudentController.SendExcuse);
Router.get('/group/:groupCode/lessons', isAuth, StudentController.Auth, StudentController.getLessons);



module.exports = Router;