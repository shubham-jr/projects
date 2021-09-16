const mongoose = require('mongoose');
const movieModel = require('./movieModel');
const reviewSchema =new mongoose.Schema({

    review:{
        type:String,
        required:[true,"review can't be blank"],
        maxlength:100,
        minlength:10
    },
    rating:{
        type:Number,
        required:[true,"review must have a rating"],
        max:10,
        min:1
    },
    movie:{
        type:mongoose.Schema.ObjectId,
        ref:'movies',
        required:[true,'review must belong to a movie']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        required:[true,'review must belong to a user']
    }

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'movie',
        select:'name'
    }).populate({
        path:'user',
        select:'name'
    });
    next();
})

reviewSchema.index({movie:1,user:1},{unique:true});

reviewSchema.statics.calcAvgRating = async function(movieId){
    console.log(movieId);
    const stats = await this.aggregate([
        {
            $match:{movie:movieId}
        },
        {
            $group:{
                _id:'$movie',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])

    console.log(stats);

    const movie = await movieModel.findByIdAndUpdate(movieId,{
        ratingsQuantity:stats[0].nRating,
        avgRating:stats[0].avgRating
    });
}

reviewSchema.post('save',function(){
    this.constructor.calcAvgRating(this.movie);
})

reviewSchema.post(/^findOneAnd/,async function(doc){

    doc.constructor.calcAvgRating(doc.movie._id);

})

const reviewModel = mongoose.model('reviews',reviewSchema);

module.exports = reviewModel;