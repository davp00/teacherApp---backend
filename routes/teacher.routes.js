const Router = require('express').Router();
const TeacherController = require('../controllers/teacher.controller');
const TokenController = require('../controllers/jwt.controller');

Router.get('/groups', TokenController.isAuth, TeacherController.Auth,TeacherController.getGroups);
Router.get('/group/:code/students',TeacherController.getGroupStudents);

module.exports = Router;