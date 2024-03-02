const express=require("express");
const { followingPosts } = require("../controllers/followController");
const { PostCreate, LikeAndUnlike, DeletePost, updateCaption, addComment, deleteComment } = require("../controllers/PostController");
const { isAuthenticated } = require("../middlewares/authorise");
const router= express.Router();

router.route("/post/upload").post(isAuthenticated,PostCreate);
router.route("/likeAndUnlike").post(isAuthenticated,LikeAndUnlike);
router.route("/deletePost/:id").delete(isAuthenticated,DeletePost);
router.route("/posts").get(isAuthenticated,followingPosts);
router.route("/post/updateCaption/:id").put(isAuthenticated,updateCaption);
router.route("/addComment/:id").post(isAuthenticated,addComment);
router.route("/deleteComment/:post_id/:comment_id").delete(isAuthenticated,deleteComment);

module.exports=router;