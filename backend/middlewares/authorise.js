const jwt=require("jsonwebtoken");
const User=require("../models/UserModel");

exports.isAuthenticated= async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({
                message:"Please login first",
            });
        }

        const decoded_id= await jwt.verify(token,process.env.JWT_Secret);

        req.user=await User.findById(decoded_id);
        next();
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
}