const movieModel = require('./../models/movieModel');
const catchAsync = require('./../utils/catchAsync');
const apiFeature = require('./../utils/apiFeature');
const appError = require('./../utils/appError');
const handlerFactory = require('./../controllers/handlerFactory');

const sendResponse = (res,statusCode,status,data)=>{
    
    res.status(statusCode).json({
        status:status,
        data
    })
}

exports.getMovie = handlerFactory.getAll(movieModel);

exports.postMovie = handlerFactory.postOne(movieModel);

exports.updateMovie = handlerFactory.updateOne(movieModel);

exports.deleteMovie = handlerFactory.deleteOne(movieModel);

exports.getOne = handlerFactory.getOne(movieModel,'reviews');

