const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username must required'],
  },
  email: {
    type: String,
    required: [true, 'User email id must required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide  valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin','user','lead-guide','guide'] ,
    default:'user' ,
  },
  password: {
    type: String,
    required: [true, 'User password must required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User confirm password must required'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    }
  },
  passwordChangedAt: Date
})

userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //this will decrypt the function and hash the password with the cost 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();

})

//candidatePassword : user pass into body
//userPassword : database password that we have to encrypt
userSchema.methods.correctPassword = (async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
})

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(changeTimeStamp, JWTTimestamp);

    return changeTimeStamp > JWTTimestamp;
  }
  //False means not changed password 
  return false
}

const User = mongoose.model('User', userSchema);
module.exports = User;