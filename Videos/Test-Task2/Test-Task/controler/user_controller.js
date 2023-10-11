const userModel = require('../models/user_model');
const taskModel = require('../models/task_model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

//to view register view
const registerLoad = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
}

//to check user credentials
const register = async (req, res) => {
    try{
        // email validation
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if(!emailRegex.test(req.body.email)) return res.status(403).render('register', { message: 'Please enter valid email'});

    const alreadyEmail=await userModel.find({email:req.body.email});
    if(alreadyEmail.length>0) return res.status(403).render('register', { message: 'User already Register' });
    
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await new userModel({ email: req.body.email, password: passwordHash }).save();
    const token = jwt.sign({ _id: user._id }, process.env.SEC_KEY);
    req.session.token = token;
    
    res.status(200).redirect('/user/dashboardLoad');}
    catch(e)
    {
        console.log(e.toString());
        res.status(500).json({success:false,message:e})
    }
}
//to load a login view
const loginLoad = async (req, res) => {
    res.render('login')
}
//to login via credentials
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await userModel.find({ email: email });
        if (findUser.length>0) {
            const bcp = await bcrypt.compare(password, findUser[0].password);
            if (bcp) {
                const token = await jwt.sign({ _id: findUser[0]._id }, process.env.SEC_KEY);
                req.session.token = token;
                res.redirect('/user/dashboardLoad');
            }
            else {
                res.render('login', { message: 'Password is wrong' });
            }   
        }
        else {
            res.render('login', { message: 'Username not found' });
        }
    } catch (error) {
        console.log(error.message)
    }
}


const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/user/loginLoad');
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try{
    const userId = req.user._id;
    console.log(req.user._id);
    await taskModel.find({ user: userId })
        .then(tasks => {
            res.render('dashboard', {
                tasks: tasks
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });}
        catch(err){
            res.status(500).send('Internal Server Error');
        }
};
module.exports = { registerLoad, register, loginLoad, login, logout, loadDashboard }