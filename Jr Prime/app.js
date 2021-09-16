const exp = require('constants');
const express = require('express');
const app = express(); 
const router = express.Router();
const path = require('path');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const movieRoutes = require('./routes/movieRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const limit = rateLimiter({
   max:100,
   windowMs:60*60*1000,
   message:'too many request from this IP'
})

app.use('/api',limit);
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp({
   whitelist:[
      
   ]
}))

app.use(express.json({limit:'10kb'}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/api/v1/movies',movieRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/reviews',reviewRoutes);

app.all('*',(req,res,next)=>{
   next(new appError(`${req.originalUrl} not found`,404));
})

app.use(globalErrorHandler);

module.exports=app;