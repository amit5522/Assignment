const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator')
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Entre Your Name"],
        maxLength: [30, "Name cannot exceed 30 charactor"],
        minLength: [4, "Name shuld have more than 4 charactor"],
    },
    email: {
        type: String,
        required: [true, "Please Entre Your Emial"],
        unique: true,
        validate: [validator.isEmail, "Please Entre a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Entre Your Password"],
        maxLength: [30, "Password cannot exceed 30 charactor"],
        minLength: [8, "Password shuld have more than 8 charactor"],
        select: false,
        //select false mean password will not appare in db but it
        //present in db.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//hash password before save

userSchema.pre('save', async function(next) {
    if (this.isModified("password")) {
        //if modified
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
})

//JWT token after register automatically login

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SCRIET, {
      expiresIn: Date.now() + process.env.JWT_EXPIRE,
    });
  };
  

const User = new mongoose.model("User", userSchema);
module.exports = User;