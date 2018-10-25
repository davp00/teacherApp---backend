const Router = require('express').Router();
const UserController = require('../controllers/user.controller');
const { isAuth } = require('../controllers/jwt.controller');

Router.post('/', UserController.Create);
Router.post('/login', UserController.Login);
Router.post('/recovery', UserController.PasswordRecovery);
Router.put('/recovery', isAuth, UserController.ChangePassword);

module.exports = Router;