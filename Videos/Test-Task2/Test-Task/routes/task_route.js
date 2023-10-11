
const taskRouter = require('express').Router();

const TaskController = require('../controler/task_controller');
const { is_login } = require('../middleware/is_login');


taskRouter.get('/edit-task/:id', is_login,TaskController.getEditTask);

taskRouter.post('/update/:id',is_login,TaskController.editTask);

taskRouter.get('/delete/:id',is_login,TaskController.deleteTask);

taskRouter.post('/add',is_login,TaskController.addTask);

taskRouter.get('/addTask',is_login,TaskController.getAddTask);
taskRouter.get('/search',is_login,TaskController.search);

module.exports = taskRouter;