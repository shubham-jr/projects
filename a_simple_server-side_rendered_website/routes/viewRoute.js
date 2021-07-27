const express=require('express');

const view_route=express.Router();

const controller=require('./../controllers/viewController.js');

view_route.route('/').get(controller.homepage);


module.exports=view_route;