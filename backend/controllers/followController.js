const Post = require("../models/PostModel");
const User = require("../models/UserModel");


exports.followOrUnfollow=async(req,res)=>{
    try {
        const UserToFollow=await User.findById(req.params.id);
        const UserLoggedIn=await User.findById(req.user._id);
        if(!UserToFollow){
            res.status(400).json({
                success:false,
                message:"User does not exist"
            });
        }
        const AlreadyFollowing=UserLoggedIn.following.includes(req.params.id);
        if(AlreadyFollowing){
            //remove following from both side(followers and following)
            //removing from User logged in 

            let index=UserLoggedIn.following.indexOf(req.params.id);
            UserLoggedIn.following.splice(index,1);
            await UserLoggedIn.save();

            //removing from followed user side
            index=UserToFollow.followers.indexOf(req.user._id);
            UserToFollow.followers.splice(index,1);
            await UserToFollow.save();

            return res.status(200).json({
                success:true,
                message:"Unfollowed"
            });
        }
        else{
            UserLoggedIn.following.push(req.params.id);
            await UserLoggedIn.save();
            UserToFollow.followers.push(req.user._id);
            await UserToFollow.save();
            return res.status(200).json({
                success:true,
                message:"followed"
            });
        }
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
}

exports.followingPosts=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id);
        const postOfFollowing=await Post.find({
            owner:{
                $in:user.following
            }
        });
        res.status(200).json({
            success:true,
            postOfFollowing,
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}