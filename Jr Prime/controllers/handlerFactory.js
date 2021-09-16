const catchAsync = require('./../utils/catchAsync');
const apiFeature = require('./../utils/apiFeature');
const appError = require('./../utils/appError');

const sendResponse = (res,statusCode,status,doc)=>{

    if(doc)length = doc.length;
    else length = undefined;  

    res.status(statusCode).json({
        result:length,
        status:status,
        doc
    })
}


exports.getAll =Model=>catchAsync(async(req,res,next)=>{   
    
    let filter = {};

    if(req.params.movieId)filter.movie = req.params.movieId;

    let apiFeatureObj = new apiFeature(req.query,Model.find(filter))
    .filter()
    .sort()
    .fields()
    .limits();
    
    const doc = await apiFeatureObj.query;
    
    if(!doc)
    return next(new appError('Ooops! doc not found',404));
    
    sendResponse(res,200,'success',doc);
    
})

exports.postOne = Model=>catchAsync(async(req,res,next)=>{

    const doc = await Model.create(req.body);
    
    sendResponse(res,200,'success',doc);
    
})    

exports.updateOne = Model=> catchAsync(async(req,res,next)=>{

    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    if(!doc)
    return next(new appError('Ooops! doc not found',404));
    
    sendResponse(res,200,'success',doc);
    
})

exports.deleteOne = Model=>catchAsync(async(req,res,next)=>{
    
    const doc = await Model.findByIdAndDelete(req.user.id);

    if(!doc)
    return next(new appError('Ooops! doc not found',404));

    sendResponse(res,200,'success',null);

})

exports.getOne = (Model,populateOption)=>catchAsync(async(req,res,next)=>{

    let query = Model.findById(req.params.id);

    if(populateOption!=null)
    query = query.populate(populateOption);

    const doc = await query;

    if(!doc)
    return next(new appError('Ooops! doc not found',404));

    sendResponse(res,200,'success',doc);

})