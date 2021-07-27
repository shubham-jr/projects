const express=require('express');

const app=express();

app.use(express.json());

app.use(express.static(__dirname + '/public'));

const review_route=require('./routes/seriesRoute.js');

const top_three_web_series=require('./routes/top_three_web_series.js');

const view_route=require('./routes/viewRoute.js');


// ------------------making-routes---------------------------------------

app.use('/series',review_route);

app.use('/top_three_web_series',top_three_web_series);

app.use('/home',view_route);


app.set('view engine','pug');

app.set('views','./views');

// ------------------------------------------------------------------------



app.all('*',(req,res,next)=>{
	res.status(404).json({
		status:'fail',
		message:`Not found ${req.originalUrl} url`
	});
});

module.exports=app;

