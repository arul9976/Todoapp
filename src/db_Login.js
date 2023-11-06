const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
    Username: String,
    Email: String,
    Password: String
})

const Login = mongoose.model('login', LoginSchema)


module.exports = Login