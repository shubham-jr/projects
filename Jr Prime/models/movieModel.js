const mongoose = require('mongoose');
const slugify = require('slugify');
const movieSchema = new mongoose.Schema({
type:{
    type:String,
    enum:['movie','web series'],
    required:[true,'type is required']
},    
name:{
    type:String,
    trim:true,
    required:[true,'movie/web series must have a name'],
    unique:true
},
year:{
    type:Number,
    required:[true,'movie/web series must have an releasing year'],
    validate:{
        validator(year)
        {
            return year<=new Date().getFullYear()?true:false;
        },
        message:'please give a valid release date'
    }
},
'18+':{
    type:Boolean,
    required:[true,'tell whether it is 18+ or not']
},
seasons:{
    type:Number,
    min:[1,'min season can only be 1'],
    max:[20,'max seasons can only be 20']
},
genre:{
    type:[String],
    required:[true,'movie/web series must have genre'],
    enum:['crime','drama','mystery','thriller','romance','18+','hacking','tech','action','animated','comedy','adventure','fantasy','history','horror','sci-fi','biography','sports','war']
},
storyLine:{
    type:String,
    minlength:[10,'minimum length of storyline should be 10'],
    maxlength:[500,'minimum length of storyline should be 100'],
    required:[true,'movie/web series must have a storyline'],
    trim:true
},
actors:{
    type:[String],
    required:[true,'movie/web series must have an actors'],
    trim:true
},
creators:{
    type:[String],
    required:[true,'movie/web series must have an creators'],
    trim:true
},
language:{
    type:[String],
    required:[true,'movie/web series must have a language'],
    lowercase:true
},
episodes:{
    type:[Number],
    min:[1,'a season have atleast 1 episode'],
    max:[50,'a season have atmost 50 episode'],
    validate:{
        validator(el)
        {
            if(this.type==='web series')
            return el.length===this.seasons;
            else
            return true;
        },
        message:'seasons and episodes are not equall'
    }
},
avgRating:{
    type:Number,
    default:7.0,
    min:[1,'rating should be greater or equall to 1'],
    max:[10,'rating should be less or equall to 10']
},
ratingsQuantity:{
    type:Number,
    default:0
},
duration:{
    type:Number,
    min:10,
    max:240,
    required:true
},
slug:String,
images:{
    type:String,
    default:'/img/deafultMovieImage.png'
}
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

movieSchema.index({genre:1});

movieSchema.pre('save',function(next){
this.slug = slugify(this.name,{lower:true});
next();
});

movieSchema.virtual('reviews',{
    ref:'reviews',
    foreignField:'movie',
    localField:'_id'
});

movieSchema.virtual('avgSeasonTime').get(function(el){
let totalEpsd = 0; 
if(this.type==='web series') 
{ 
this.episodes.forEach(el=>{
totalEpsd+=el;
})
return this.duration*totalEpsd; 
}    
});

const movieModel = mongoose.model('movies',movieSchema);
module.exports = movieModel;