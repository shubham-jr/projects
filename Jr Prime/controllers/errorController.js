const appError = require("../utils/appError");

const handleCastErrorDB = err=>{
    const message = `invalid ${err.path}:${err.value}`;
    return new appError(message,400);
}

const dublicateErrorDB = err=>{
    const message = `${err.keyValue.name} already exist`;
    return new appError(message,400);
}


const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    })
}

const sendErrorProd = (err,res)=>{
    // trusted error:send to the client
    if(err.isOperational)
    {
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }else //unknown or programming error:sensitive error
    {
        res.status(500).json({
            status:'fail',
            message:'something went wrong!!!'
        })
    }
}

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode||500;
    err.status = err.status||'error';    

    if(process.env.NODE_ENV==='development')
    {
        sendErrorDev(err,res);
    }
    else if(process.env.NODE_ENV==='production')
    {
        let error = {...err};

        console.log(error);    

        if(error.stack&&(error.stack.split(':')[0]==='CastError'))
            error = handleCastErrorDB(error);

        if(error.code===11000)
            error = dublicateErrorDB(error);


        sendErrorProd(error,res);    
    }

}