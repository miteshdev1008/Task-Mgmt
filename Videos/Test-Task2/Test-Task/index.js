require('dotenv').config();
const http = require('http');
const exp = require('express');
const cors = require('cors');
const bp = require('body-parser');
const session = require('express-session');
const app = exp();
const cron = require('node-cron');
const session_secret = process.env.SESSION_SECRET;
const Task=require('./models/task_model');
//gethering the port from env
const port = process.env.PORT;
//getting the base_url from env file
const base_url = process.env.BASE_URL;

//app using session
app.use(session({
    secret: process.env.SES_KEY, 
    resave: false,
    saveUninitialized: true,
  }));

//enables app to use json data
app.use(exp.json());
//enables to use cross origin request acccepts
app.use(cors())

app.use(bp.urlencoded({ extended: true }));

//setting up the ejs engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(exp.static('public'));
require('./dbo');

//user routes
app.use('/user', require('./routes/user_route'))
//task routes
app.use('/', require('./routes/task_route'))

//server
const server = http.createServer(app);
//for crone jobs to check daily on every night at 12 pm
cron.schedule('0 0 * * *', async () => {
  
  const currentDate = new Date();
  const tasks = await Task.find({ dueDate: { $gte: currentDate } });

  tasks.forEach((task) => {
    // Calculate the number of days until the due date
    const timeUntilDue = Math.floor((task.dueDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (timeUntilDue <= 2) {
      // Add a notification for tasks due within 2 days
      task.notifications.push({
        message: `Task "${task.title}" is due in ${timeUntilDue} day(s).`,
        timestamp: currentDate,
      });
    }
    
    // Save the updated task
    task.save();
  });
});

//listening the server
server.listen(port, base_url, () => {
    console.log("app is live at" + "  " + base_url + ":" + port);
    
  })