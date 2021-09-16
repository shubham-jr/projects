const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:30,
        required:[true,'user must have a name']
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,'please enter a valid email'],
        required:[true,'user nust have an email']
    },
    password:{
        type:String,
        minlength:[8,'please choose a strong password'],
        required:[true,'usermust have a password'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            validator(el){
                return el===this.password;
            },
            message:'passsword not matched'
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    photo:{
        type:String,
        default:'/images/deafultUserImage'
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpires:Date,
    active:{
        type:Boolean,
        default:true
    }
});

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    return next();
    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.checkHashedPassword = async function(plainPass,encyPass)
{
    return await bcrypt.compare(plainPass,encyPass);
}

userSchema.methods.checkUpdatePassword = function(iat,changePasswordAt)
{
     if(this.passwordChangedAt)
    {
        changePasswordAt = changePasswordAt.getTime()/1000;
        return changePasswordAt<iat;
    }
    return true
}

userSchema.methods.createPasswordResestToken = function(){
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetTokenExpires = Date.now()+10*60*1000;
    return token;
}

const userModel = mongoose.model('users',userSchema);
module.exports = userModel;
