const userModel = require('./../models/userModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./../controllers/handlerFactory')

const filterObj = (obj,...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el))
        return newObj[el] = obj[el];
    })
    return newObj;
}

const sendResponse = (res,data,statusCode,status)=>{
    res.status(statusCode).json({
        status:status,
        data
    })
}

exports.updateMe = catchAsync(async(req,res,next)=>{

    if(req.body.password||req.body.passwordConfirm)
    return next(new appError('use /updatePassword route to update the password',404));

    const filterBody = filterObj(req.body,'name','email');

    const updatedUser = await userModel.findByIdAndUpdate(req.user.id,filterBody,{
        new:true,
        runValidators:true
    })

    sendResponse(res,updatedUser,200,'success');

})

// exports.deleteMe = catchAsync(async(req,res,next)=>{

//     await userModel.findByIdAndUpdate(req.user.id,{active:false},{
//         new:true,
//         runValidators:true
//     })

//     sendResponse(res,null,201,'success');

// })

exports.getMe = catchAsync(async(req,res,next)=>{

    const user = await userModel.findById(req.user.id);

    sendResponse(res,user,201,'success');
    
})

exports.getAllUser = handlerFactory.getAll(userModel);

exports.getUser = handlerFactory.getOne(userModel,null);

exports.deleteMe = handlerFactory.deleteOne(userModel);