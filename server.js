const mongoose = require('mongoose') ;
const dotenv = require('dotenv') ;
dotenv.config({
    path :'./config.env'
});

process.on('uncaughtException',err => {
    console.log('UNCAUGHT REJECTION 💥') ;
    console.log(err.name,err.message);
    process.exit(1) ;

})

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD) ;

mongoose.connect(DB,{
    useNewUrlParser : true ,
    useCreateIndex : true ,
    useFindAndModify : false ,
    useUnifiedTopology: true
}).then(() => console.log('DB connections successful')) ;

const app = require('./app')

const server = app.listen(6000, () => {
    console.log("App running on the port 6000");
});

process.on('unhandledRejection',err => {
    console.log('UNHANDLED REJECTION 💥') ;console.log(err.name,err.message);
    server.close(() =>{
        process.exit(1) ;
    });
})


