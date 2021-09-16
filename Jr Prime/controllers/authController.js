const mongoose = require('mongoose');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const userModel = require('../models/userModel');
const jwt = require('jsonwebToken');
const crypto = require('crypto');

const getToken = (id)=>{
    const token = jwt.sign({id},process.env.SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
    return token;
}

const sendResponse = (res,statusCode,status,data,token)=>
{
    const cookieOptions = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV === 'production')
    cookieOptions.secure = true;

    res.cookie('jwt',token,cookieOptions)
    data.password = undefined;
    res.status(statusCode).json({
        status:status,
        token,
        data
    })
}

exports.signup = catchAsync(async(req,res,next)=>{

    const user = await userModel.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt:req.body.passwordChangedAt,
        role:req.body.role,
        passwordResetToken:req.body.passwordResetToken,
        passwordResetTokenExpires:req.body.passwordResetTokenExpires
    });

    const token= getToken(user._id);

    sendResponse(res,200,'success',user,token);
})

exports.login = catchAsync(async(req,res,next)=>{

    const {email,password} = req.body;

    if(!email || !password)
    return next(new appError('blank field not allowed',404));

    const user = await userModel.findOne({email}).select('+password');

    if(!user || !(await user.checkHashedPassword(password,user.password)))
    return next(new appError('invalid email or password',404));

    const token = getToken(user._id);

    sendResponse(res,200,'success',user,token);
    
    
})

exports.protect = catchAsync(async(req,res,next)=>{

    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer'))
    token =req.headers.authorization.split(' ')[1];
    
    if(!token)
    return next(new appError('you are not logged in!!Please logged in',404));

    const decode = await jwt.verify(token,process.env.SECRET_KEY);

    const user = await userModel.findById({_id:decode.id});

    if(!user)
    return next(new appError('user belonged to this token no longer exist'));

   
    if(!user.checkUpdatePassword(decode.iat,user.passwordChangedAt))
    return next(new appError('password recently changed!! Please login again',404));

    req.user = user;

    next();

})

exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        return next(new appError('You are not allowed to access this route',404));
        next();
    }
}

exports.forgotPassword = catchAsync(async(req,res,next)=>{

    if(!req.body.email)
    return next(new appError('please provide a valid email'));

    const user = await userModel.findOne({email:req.body.email});

    if(!user)
    return next(new appError('Please provide an valid email',404));

    const resetToken = user.createPasswordResestToken();

    await user.save({validateBeforeSave:false});

    const resetLink = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/
    ${resetToken}`;
    const message = `Want to reset your password?? 
    click on the link
    ${resetLink} 
    if it is not you then ignore it!!`;
    try
    {
        await sendEmail({
        email:user.email,
        message,
        subject:'Your password reset token(only valid for 10mins)'
    });
    sendResponse(res,200,'success','reset token sent successfully!!',undefined);
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save({validateBeforeSave:false});
        console.log(err);
        return next(new appError('error in sending mail...',404));
    }
})

exports.resetPassword = catchAsync(async(req,res,next)=>{

    const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await userModel.findOne({passwordResetToken:hashedToken,
        passwordResetExpires:{$gt:Date.now()}
        });

    if(!user)
    return next(new appError('token maybe expired ,invalid or used',404));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    sendResponse(res,200,'password successfully updated...!! Go for login',undefined);    
    
})

exports.updatePassword = catchAsync(async(req,res,next)=>{
    const user = await userModel.findById({_id:req.user.id}).select('+password');

    const plainPass = req.body.currentPass;
    console.log(plainPass,user.password);

    if(!(await user.checkHashedPassword(plainPass,user.password)))
    return next(new appError('incorrect current password',404));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.save();
    sendResponse(res,200,'password changed successfully',undefined);
})