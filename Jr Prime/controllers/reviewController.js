const reviewModel = require('./../models/reviewModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./../controllers/handlerFactory');

exports.setId = catchAsync(async(req,res,next)=>{

    if(!req.body.user)req.body.user = req.user.id;

    if(!req.body.movie)req.body.movie = req.params.movieId;

    next();
})

const sendResponse = (res,statusCode,status,data)=>{
    
    res.status(statusCode).json({
        status:status,
        data
    })
}


exports.deleteReview = catchAsync(async(req,res,next)=>{

    await reviewModel.findByIdAndDelete(req.params.id);

    sendResponse(res,200,'success',null);
    
});

exports.getMyReviews = catchAsync(async(req,res,next)=>{

    const reviews = await reviewModel.find({user:req.user.id});

    sendResponse(res,200,'success',reviews);

})

exports.getAllReview = handlerFactory.getAll(reviewModel);

exports.postReview =  handlerFactory.postOne(reviewModel);

exports.updateReview = handlerFactory.updateOne(reviewModel);
