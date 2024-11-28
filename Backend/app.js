const express = require('express')
const morgan = require('morgan')
const app = express()
const createAndIntitailizeServer = require('./database.js')
const User = require('./Models/userModel.js')
const userRouter = require('./Router/userRouter')
const taskRouter = require('./Router/taskRouter')
app.use(express.json())
app.use(morgan('dev'))

createAndIntitailizeServer()

app.use('/user', userRouter)
app.use('/', taskRouter)

app.listen(3000, ()=> {
    console.log('App running succesfully at 3000 port')
})


