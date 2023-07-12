
const express = require('express');
const app = express();
const tourRouter = require('./routes/tourRoute') ;
const userRouter = require('./routes/userRoute') ;
console.log(process.env.PORT) ;
app.use(express.json())
const errorHandler = require('./controller/errorController') ;
const AppError = require('./utils/AppError') ;

app.use((req,res,next) => {
    // console.log(req.headers) ;
    next() ;
})
app.use('/api/v1/tours',tourRouter) ;
app.use('/api/v1/users',userRouter) ;

app.all('*',(req,res,next) =>{
    // const err = new Error(`Can't find ${req.originalUrl} on this server !`)
    // err.status = 'fail' ;
    // err.statusCode = 404 ;

    next(new AppError(`Can't find ${req.originalUrl} on this server !`,404)) ;
})

app.use(errorHandler) ;

module.exports = app ;