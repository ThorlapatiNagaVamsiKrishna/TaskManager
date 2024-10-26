const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/taskManager'

const createAndIntitailizeServer = async () => {
    try {
        await mongoose.connect(uri)
        console.log('MongoDB connected successfully')
    }
    catch(error){
        console.log('MongoDB connection failed successfully')
    };
    
}

module.exports = createAndIntitailizeServer