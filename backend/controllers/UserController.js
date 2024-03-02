const User = require("../models/UserModel");
const Post = require("../models/PostModel");

exports.RegisterUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"email already registered",
            });
        }
        user=await User.create({
            name,
            email,
            password,
            avatar:{
                public_id:"sample_id",
                url:"sample/url",
            }

        });
        const token=await user.generateToken();
        const token_property={
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true,
        }
        res.status(200).cookie("token",token,token_property).json({
            success:true,
            user,
            token,
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        });
    }
}

exports.login= async(req,res)=>{

    try {
        const {email,password}=req.body;
        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist, register first",
            });
        }

        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password",
            });    
        }
        const token=await user.generateToken();
        const token_property={
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true,
        }
        res.status(200).cookie("token",token,token_property).json({
            success:true,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.logout=async(req,res)=>{
    try {
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
            success:true,
            message:"Logged Out",
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


exports.changePassword=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).select("+password");
        const {oldPassword,newPassword}=req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:"Please enter old and new password",
            });
        }
        const isMatch=await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Old Password",
            });
        }
        else{
            user.password=newPassword;
            await user.save();
            res.status(201).json({
                success:true,
                message:"Password Changed Successfully"
            });
        }

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.changeProfile=async(req,res)=>{
    try {
        const {name,email}=req.body;
        const user=await User.findById(req.user._id);
        if(name){
            user.name=name;
        }
        if(email){
            user.email=email;
        }
        await user.save();
        res.status(200).json({
            success:true,
            message:"Profile updated",
        });

        //avatar to do
    } catch (error) {
        res.status(500).json({
            success:true,
            message:error.message,
        });
    }
}

exports.deleteProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id);
        const posts=user.posts;
        const following=user.following;
        const followers=user.followers;
        //removing all post of user
        for(let i=0;i<posts.length;i++){
            const post=await Post.findById(posts[i]);
            if(post){
                await post.remove();
            }
            else{
                continue;
            }
        }
        //removing user from followed peoples followers(following of people who are followed by user)
        for(let i=0;i<following.length;i++){
            const user_followed=await User.findById(following[i]);
            const index=user_followed.followers.indexOf(req.user._id);
            user_followed.followers.splice(index,1);
            await user_followed.save();
        }
        //removing user from followers following(removing user from people following who followed user)
        for(let i=0;i<followers.length;i++){
            const user_following=await User.findById(followers[i]);
            const index=user_following.following.indexOf(req.user._id);
            user_following.following.splice(index,1);
            await user_following.save();
        }

        //logging out
        await user.remove();
        res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})

        res.status(200).json({
            success:true,
            message:"User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.myProfile=async(req,res)=>{
    try {
        const profileData=await User.findById(req.user._id).populate("posts");
        res.status(200).json({
            success:true,
            profileData
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


exports.getUserProfile=async(req,res)=>{
    try {
        const userProfile=await User.findById(req.params.id).populate("posts");
        res.status(200).json({
            success:true,
            userProfile
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}