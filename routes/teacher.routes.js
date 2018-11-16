const Router = require('express').Router();
const TeacherController = require('../controllers/teacher.controller');
const TokenController = require('../controllers/jwt.controller');

Router.get('/groups', TokenController.isAuth, TeacherController.Auth,TeacherController.getGroups);

Router.get('/group/:code/students',TokenController.isAuth, TeacherController.Auth,TeacherController.getGroupStudents);

Router.get('/lesson/:code',TokenController.isAuth, TeacherController.Auth, TeacherController.getLesson);

Router.post('/group/lesson', TokenController.isAuth, TeacherController.Auth, TeacherController.NewLesson);

Router.put('/group/lesson', TokenController.isAuth, TeacherController.Auth, TeacherController.EndLesson);

Router.get('/group/:groupCode/info', TokenController.isAuth, TeacherController.Auth, TeacherController.getGroupInformation);

module.exports = Router;