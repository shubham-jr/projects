const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const express = require('express');

const router = express.Router({mergeParams:true});

router.route('/')
.get(authController.protect,reviewController.getAllReview)
.post(authController.protect,reviewController.setId,authController.restrictTo('user'),reviewController.postReview);

router.route('/:id')
.patch(authController.protect,reviewController.updateReview)
.delete(authController.protect,reviewController.deleteReview);

router.route('/my-reviews')
.get(authController.protect,authController.restrictTo('user'),reviewController.getMyReviews);

module.exports = router;
