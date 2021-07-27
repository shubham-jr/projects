const express=require('express');

const controllers=require('./../controllers/seriesController.js');

const review_route=express.Router();

review_route.route('/').get(controllers.getdata).post(controllers.postdata);

review_route.route('/:id').get(controllers.get_a_data).patch(controllers.update_a_data).delete(controllers.delete_a_data);

module.exports=review_route;