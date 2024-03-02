const Post=require("../models/PostModel");
const User = require("../models/UserModel");
exports.PostCreate=async(req,res)=>{
    try{
        const newPostData={
            caption:req.body.caption,
            image:{
                public_id:"req.body.public_id",
                url:"req.body.url",
            },
            owner:req.user._id,
        };

        const newPost=await Post.create(newPostData);
        const user=await User.findById(req.user._id);
        user.posts.push(newPost._id);
        await user.save();

        res.status(201).json({
            success:true,
            newPost,
            name:user.name,
            email:user.email,
        })
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }

}

exports.DeletePost=async(req,res)=>{
   try {
    const PostId=req.params.id;
    const post=await Post.findById(PostId);
    if(!post){
        return res.status(404).json({
            success:false,
            message:"Post does not exist",
        });
    }
    else{

        const user=await User.findById(req.user._id);
        if(user.posts.includes(PostId)){
            await post.remove();
            const index=user.posts.indexOf(PostId);
            user.posts.splice(index,1);
            await user.save();
            return res.status(200).json({
                success:true,
                message:"Post Deleted Successfully",
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"UnAuthorised",
            });
        }
        
    }
   } catch (error) {
        res.status(500).json({
            message:error.message
        });
   }
}

exports.LikeAndUnlike=async(req,res)=>{
    try {
        const {postId}=req.body;
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post does not exit",
            });
        }
        
        const ifLikeExist=post.likes.includes(req.user._id);
        if(ifLikeExist){
            const index=post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);
            await post.save();
            res.status(201).json({
                success:true,
                message:"Unliked",
                name:req.user.name,
            });
        }
        else{
            post.likes.push(req.user._id);
            await post.save();
            res.status(201).json({
                success:true,
                message:"Liked",
                name:req.user.name,
            });
        }
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
}


exports.updateCaption=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(400).json({
                success:false,
                message:"UnAuthorised",
            });
        }
        else{
            post.caption=req.body.caption;
            await post.save();
            res.status(200).json({
                success:true,
                message:"Caption updated",
            });
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.addComment=async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found",
            });
        }
        post.comments.push({
            user:req.user._id,
            comment:req.body.comment
        });
        await post.save();
        res.status(201).json({
            success:true,
            message:"Comment posted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.deleteComment=async(req,res)=>{
    const post=await Post.findById(req.params.post_id);
    if(post.owner.toString()===req.user._id.toString()){
        let comment_exist=false;
        post.comments.forEach((item,index)=>{
            if(item._id.toString()===req.params.comment_id.toString()){
                comment_exist=true;
                return post.comments.splice(index,1);
            }
        });
        if(comment_exist){
            await post.save();
            res.status(200).json({
                success:true,
                message:"Comment deleted successfully as u are the owner you can delete any comment"
            });
        }
        else{
            res.status(404).json({
                success:false,
                message:"Comment not exist"
            });
        }
    }
    else{
        let deleted=false;
        post.comments.forEach((item,index)=>{
            if(item._id.toString()===req.params.comment_id.toString() && item.user.toString()===req.user._id.toString()){
                    deleted=true;
                    return post.comments.splice(index,1);
            }
        });
        if(deleted){
            await post.save();
            res.status(200).json({
                success:true,
                message:"Comment deleted successfully u r not the owner of the post but the owner of comment"
            });        
        }
        else{
            res.status(404).json({
                success:false,
                message:"Comment can not be deleted"
            });
        }
    }
}