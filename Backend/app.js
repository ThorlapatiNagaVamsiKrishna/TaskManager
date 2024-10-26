const express = require('express')
const app = express()
const createAndIntitailizeServer = require('./database.js')
const User = require('./Models/userModel.js')
app.use(express.json())

createAndIntitailizeServer()

app.listen(3000, ()=> {
    console.log('App running succesfully at 3000 port')
})
