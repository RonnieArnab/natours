const Tour = require("../models/toursModel");

class APTFeatures {
    constructor(query,queryString) {
        this.query = query ;
        this.queryString = queryString ;
    }

    filter(){
        const queryObj = {...this.queryString} ;
        const excludeFields = ['page','sort','limit','fields'] ;
        excludeFields.forEach(el => delete queryObj[el]) ;

        let queryStr = JSON.stringify(queryObj) ;
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`) ;
        this.query.find(JSON.parse(queryStr)) ;

        let query = Tour.find(JSON.parse(queryStr)) ;

        return this ;
    }

    sort(){
        if(this.queryString.sort) {
            this.queryString.sort = this.queryString.sort.replace(/\b(,)\b/g,' ') ;
            this.query =this.query.sort(this.queryString.sort) ;
        }
        else{
            this.query =this.query.sort("-createdAt") ;
        }

        return this ;
    }

    limitFields(){
        if(this.queryString.fields) {
            this.queryString.fields = this.queryString.fields.replace(/\b(,)\b/g,' ') ;
            this.query = this.query.select(this.queryString.fields) ;
        }
        else{
            this.query = this.query.select("-__v") ;
        }

        return this ;
    }

    pagination(){
        const page = this.queryString.page *1 || 1 ;
        const limit = this.queryString.limit *1 || 100 ;
        const skip = (page-1)*limit ;

        this.query = this.query.skip(skip).limit(limit) ;


        return this ;
    }
}

module.exports = APTFeatures ;