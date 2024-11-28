const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../Models/userModel')


// middleware authentication function
const authenticateToken = async (request, response, next) => {
    const jwtToken = request.headers.authorization.split(' ')[1];
    if (jwtToken === undefined) {
        response.send('Invalid JWT Token')
    } else {
        jwt.verify(jwtToken, 'VAMSI', async (error, payload) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return response.status(401).send('Token has expired');
                }
                return response.status(403).send('Invalid token')
            }
            else {
                request.userId = payload.userId;
                next()
            }
        })
    }

}


router.post('/Tasks', authenticateToken, async (request, response, next) => {
    console.log(request.body)
    const { userId } = request
    console.log(userId)
    const findUserQuery = await User.findOne(request.email)
    try {
        if (findUserQuery) {
            const createNewTask = await User.findOneAndUpdate(request.email, { $push: { taskList: request.body } }, { new: true, runValidators: true })
            response.status(200).json({
                status: "success",
                message: "Task added successfully"
            })
        }
        else {
            response.status(400).json({
                status: 'error',
                message: 'Failed to add new task'
            })
        }
    } catch (error) {
        console.log(error.name)
        response.status(400).json({ error: error.message, status: 'failure' })
    }

})

router.get('/userTasks', authenticateToken, async (request, response) => {
    const { userId } = request
    try {
        const isUser = await User.findById(userId)
        if (isUser) {
            response.send(isUser.taskList)
        }
        else {
            response.status(400).json({
                message: 'user not found',
                status: 'failure'
            })
        }
    }
    catch (error) {
        response.status(400).json({
            message: error.message,
            status: 'failure'
        })

    }

})

router.get('/getSingleTask/:taskId', authenticateToken, async (request, response) => {
    try {
        const { userId } = request
        const { taskId } = request.params
        const user = await User.findById(userId)
        const task = user.taskList.find(each => each.id === taskId)
        response.send(task)
    }
    catch (error) {
        response.status(400).json({
            message: error.message,
            status: 'failed'
        })
    }
})

router.delete('/getSingleTask/:taskId', authenticateToken, async (request, response) => {
    try {
        const { userId } = request
        const { taskId } = request.params
        const user = await User.findById(userId)
        const task = user.taskList.find(each => each.id === taskId)
        if(task) {
            const deleteTask = await User.updateOne({_id: userId},{$pull: {taskList:{_id: taskId}}})
            response.status(200).json({
                message: 'task delete',
                status: 'success'
            })
        }
        else {
            response.status(400).json({
                message: 'task not found',
                status: 'failed'
            })
        }
        
    }
    catch (error) {
        response.status(400).json({
            message: error.message,
            status: 'failed'
        })
    }
})

router.patch('/getSingleTask/:taskId', authenticateToken, async (request, response) => {
    console.log(request.body)
    try {
        const { userId } = request
        const { taskId } = request.params
        const user = await User.findById(userId)
        const task = user.taskList.find(each => each.id === taskId)
        if(task) {
            const updateTask = await User.updateOne({_id: userId, "taskList._id":taskId},{$set: {"taskList.$.task_title":request.body.task_title, "taskList.$.task_title":request.body.task_title, "taskList.$.task_description":request.body.task_description,"taskList.$.status":request.body.status, "taskList.$.category":request.body.category}})
            response.status(200).json({
                message: 'task update',
                status: 'success'
            })
        }
        else {
            response.status(400).json({
                message: 'task not found',
                status: 'failed'
            })
        }
        
    }
    catch (error) {
        response.status(400).json({
            message: error.message,
            status: 'failed'
        })
    }
})
module.exports = router

