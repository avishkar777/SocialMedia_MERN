const express=require("express");
const { followOrUnfollow } = require("../controllers/followController");
const { RegisterUser, login, logout, changePassword, changeProfile, deleteProfile, myProfile, getUserProfile } = require("../controllers/UserController");
const { isAuthenticated } = require("../middlewares/authorise");
const router=express.Router();

router.route("/Register").post(RegisterUser);
router.route("/login").post(login);
router.route("/follow/:id").get(isAuthenticated,followOrUnfollow);
router.route("/logout").get(isAuthenticated,logout);
router.route("/changePassword").put(isAuthenticated,changePassword);
router.route("/changeProfile").put(isAuthenticated,changeProfile);
router.route("/me/deleteProfile").delete(isAuthenticated,deleteProfile);
router.route("/me/profile").get(isAuthenticated,myProfile);
router.route("/profile/:id").get(isAuthenticated,getUserProfile);
module.exports=router;