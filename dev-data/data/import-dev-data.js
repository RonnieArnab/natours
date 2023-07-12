const fs =  require('fs') ;
const mongoose = require('mongoose');
const dotenv = require('dotenv') ;
const Tour = require('./../../models/toursModel') ;
dotenv.config({
    path :`${__dirname}/../../config.env`
});
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD) ;


mongoose.connect(DB,{
    useNewUrlParser : true ,
    useCreateIndex : true ,
    useFindAndModify : false ,
    useUnifiedTopology: true ,
}).then(() => console.log('DB connections successful'));


//read data from json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8')) ;

//import data to the database
const importData = async () => {
    try{
        await Tour.create(tours) ;
        console.log('data successfully loaded') ;
        process.exit() ;
    }
    catch (err) {
        console.log(err) ;
    }
}

//delete all data form collections

const deleteData = async () => {
    try {
        await Tour.deleteMany() ;
        console.log('data successfully deleted') ;
        process.exit() ;
    }
    catch (err) {
        console.log(err) ;
    }
}

if(process.argv[2] === '--import'){
    importData() ;
}
else if(process.argv[2] === '--delete'){
    deleteData() ;
}
