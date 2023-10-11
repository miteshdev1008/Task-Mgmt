const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {type:String},
    status: [{
      type: String,
      enum: ['incomplete', 'complete', 'pending'] 
  }],
  notifications: [{
    message: String,
    timestamp: Date,
  }],
    dueDate: {
      type: Date
    },
    priority:{
      type:String
    },
    label:{type:String},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User-test',
      required: true,
    },
  });module.exports = mongoose.model('TaskModule', taskSchema);