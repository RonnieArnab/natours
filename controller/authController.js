const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync') ;
const jwt = require('jsonwebtoken') ;
const appError = require('../utils/AppError') ;
const { promisify } = require('util') ;
const AppError = require('../utils/AppError');

const signToken = id => {
  return jwt.sign({
      id },process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }) ;
}

exports.signup = catchAsync(async (req,res,next) => {
  const newUser = await User.create({
    name : req.body.name ,
    email : req.body.email ,
    password : req.body.password ,
    passwordConfirm : req.body.passwordConfirm ,
    passwordChangedAt: req.body.passwordChangedAt ,
    role : req.body.role ,  
  }) ;

  const token = signToken(newUser._id) ;

  res.status(201).json({
    status : 'success' ,
    token ,
    data : {
      user : newUser ,
    }
  });
});

exports.login = catchAsync(async (req,res,next) => {
  const {email,password} = req.body ;
   // if email and password exist
  if(!email || !password){
    return next(new appError('Please provide a valid email and password',400)) ;
  }
  // if users exists && password s correct
  const user = await User.findOne({email : email}).select('+password') ;

  if(!user || !(await user.correctPassword(password,user.password))){
    return next(new appError('Incorrect email or password',401)) ;
  }

  //if everything is ok , send a token to the client
  const token = signToken(user._id) ;
  res.status(200).json({
    status : 'success' ,
    token
  })
})

exports.protect = catchAsync(async (req,res,next) =>{
  let token
  //1. get token and check of it's there
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1] ;
  }
  // console.log(token) ;

  if(!token){
    return next(new appError('You are not logged in !! Please login ',401))
  }
  //2. Verification token
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET) ;
  //3. User still exists or not
  const freshUser = await  User.findById(decoded.id) ;

  if(!freshUser){
    return next(new AppError('The user belonging to this user does no longer exist.',401)) ;
  }
  //4. Check if the user changing the password if the token is issued
  if(freshUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed the password ! please login again',401));
  } ;

  req.user = freshUser ; 
  next() ; 
})

exports.restrictTo = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new AppError('You dont have permission to preform this action ',403))
    }
    next() ;
  }
}