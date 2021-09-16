const movieController = require('./../controllers/movieController');
const authController = require('./../controllers/authController');
const reviewRoutes = require('./../routes/reviewRoutes');
const express = require('express');
const router = express.Router();

router.route('/')
.get(movieController.getMovie)
.post(authController.protect,authController.restrictTo('admin'),movieController.postMovie);


router.route('/:id')
.get(authController.protect,movieController.getOne)
.patch(authController.protect,authController.restrictTo('admin'),movieController.updateMovie)
.delete(authController.protect,authController.restrictTo('admin'),movieController.deleteMovie);

router.use('/:movieId/reviews',reviewRoutes);

module.exports = router;