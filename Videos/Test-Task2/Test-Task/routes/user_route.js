
const userRouter = require('express').Router();

const path = require('path');
const { registerLoad,register, loginLoad, login, logout, loadDashboard } = require('../controler/user_controller');
const { is_login } = require('../middleware/is_login');

userRouter.get('/registerLoad',registerLoad);

userRouter.post('/register',register);

userRouter.get('/loginLoad',loginLoad);

userRouter.post('/login',login);

userRouter.get('/logout',logout);

userRouter.get('/dashboardLoad' ,is_login,loadDashboard);

module.exports = userRouter;