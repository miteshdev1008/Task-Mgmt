const taskModel = require('../models/task_model');

exports.getAddTask = (req, res, next) => {
    res.render("addTask");
};

exports.addTask = async (req, res) => {
    try {
        const userid = req.user._id;
        console.log(userid);
        const newTask = await new taskModel({
            title: req.body.title, 
            description: req.body.description,
            status: req.body.status,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            label:req.body.label,
            user: userid
        }).save();
        const tasks = await taskModel.find({user:userid});
        console.log(tasks);
        res.render('dashboard', { tasks: tasks });
    } // Redirect to user dashboard after adding the task}
    catch (e) {
        res.status(500).json({ succes: false, message: e });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const userid = req.user._id;
        console.log(userid);
        const taskId = req.params.id;
        await taskModel.findByIdAndDelete(taskId);
       const tasks = await taskModel.find({user:userid});
        res.render('dashboard', { tasks: tasks });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: e });
    }

}

exports.editTask = async (req, res) => {
    try {
        const userid = req.user._id;
        console.log(userid);
        const taskId = req.params.id;
        await taskModel.findByIdAndUpdate(taskId, { $set: req.body });
        
        const tasks = await taskModel.find({user:userid});
        res.render('dashboard', { tasks: tasks });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: e });
    }

};

exports.getEditTask = async (req, res) => {
    const taskId = req.params.id;
    await taskModel.findById(taskId)
        .then(task => {
            if (!task) {
                res.status(404).send('Task not found');
            } else {
                res.render('editTask', {
                    path: '/editTask',
                    tasks: [task] // Wrap the task object in an array
                });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });

    };

exports.getaddTask = async (req, res) => {
    try {
        const newTask = await new taskModel(req.body).save();
        res.redirect('/dashboard');
        res.json({ success: true, message: 'Yes task added ' })
    }
    catch (e) {
        res.json({ succes: false, message: e });
    }

};

exports.search=async (req, res) => {
    const search = req.query.search || ''; // Get the search query from the URL
    const statusFilter = req.query.statusFilter || ''; // Get the status filter from the URL
    try {
        let query = taskModel.find(); 
        console.log("abc"+statusFilter);
        console.log(query);
        // Apply search filter
        if (search) {
            query = query.or([
                { title: { $regex: search, $options: 'i' } }, // Case-insensitive title search
                { description: { $regex: search, $options: 'i' } }, // Case-insensitive description search
            ]);
        }

        // Apply status filter
        if (statusFilter) {
            query = query.where('status').equals(statusFilter);
        }
        const tasks = await query.exec(); 
        console.log(tasks);

        res.render('dashboard', { tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching tasks');
    }};