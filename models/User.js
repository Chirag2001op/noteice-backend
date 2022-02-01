const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, //Helps to connect notes to a specific user
        ref: 'user'
    }, 
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    email:{
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
         default: Date.now
    }
})

const User = mongoose.model('user', UserSchema);
module.exports = User;