const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    task_title: {
        type: String, 
        required: [true, 'Task_title is required']
    }, 
    task_description: {
        type: String,
    }, 
    status: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    },

})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Date, 
        default: Date.now 
    },
    taskList: [taskSchema]
})

const User = mongoose.model('User', userSchema)
module.exports = User