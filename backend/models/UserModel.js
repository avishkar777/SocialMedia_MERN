const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const UserSchema=new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please enter the name"],
    },
    email:{
        type:String,
        required:[true,"Please enter a email"],
        unique:[true,"Email must be unique"],
    },
    avatar:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    password:{
        type:String,
        required:[true,"Please Enter a password"],
        minlength:[8,"Password should consist alteast 8 charachter"],
        select:false,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
});

UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8);
    }
    else{
        next();
    }
});

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

UserSchema.methods.generateToken=function(){
    return jwt.sign({_id:this._id},process.env.JWT_Secret);
}

module.exports=mongoose.model("User",UserSchema);