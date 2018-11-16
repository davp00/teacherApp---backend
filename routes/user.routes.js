const Router = require('express').Router();
const UserController = require('../controllers/user.controller');
const { isAuth } = require('../controllers/jwt.controller');

Router.get('/', isAuth, UserController.ProfileInfo);
Router.post('/', UserController.Create);
Router.post('/login', UserController.Login);
Router.post('/recovery', UserController.PasswordRecovery);
Router.post('/recoveryToken', isAuth, UserController.ValidateRecoveryToken);
Router.put('/changepassword', isAuth, UserController.ChangePassword);

module.exports = Router;