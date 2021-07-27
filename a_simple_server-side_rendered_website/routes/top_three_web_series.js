const express=require('express');

const controllers=require('./../controllers/seriesController.js');

const top_three_web_series=express.Router();

top_three_web_series.route('/').get(controllers.api_aliasing_middleware,controllers.top_three_web_series);

module.exports=top_three_web_series;