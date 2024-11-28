const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../Models/userModel')

// Find all user API

router.get('/all', async (request, response) => {
    const findAllUsers = await User.find()
    response.send(findAllUsers)
})


// Register Page API  
router.post('/signup', async (request, response) => {
    try {
        const userDetails = await User.find({email: request.body.email})
        if (userDetails.length === 1) {
            response.send('User already exists')
        }
        else {
            const insertUser = request.body
            const hassedPassword = await bcrypt.hash(insertUser.password, 10) 
            const createUserQuery = await User({...insertUser, password: hassedPassword})
            const result = await createUserQuery.save()
            response.send(result)
        }
    }
    catch(error){
        response.send(`Server running down state Now ${error}`)
    };
  
})

// Longin Page API
router.post('/login', async (request, response) => {
    const findUser = await User.findOne({email: request.body.email}, {__v: 0})
    console.log(findUser)
    const userId = findUser._id
    if(!findUser) {
        response.send('user not found') 
    }
    else{
        const isUser = await bcrypt.compare(request.body.password, findUser.password)
        if(isUser){
           const authToken =  jwt.sign({userId},'VAMSI')
           response.send(authToken)
        }
        else{
           response.send('incorrect password')
        }
    }
})




module.exports = router