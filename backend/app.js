const express =require("express");
const app = express();
const cookieParser=require("cookie-parser");

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//importing routes
const User=require("./routes/User");
const Post=require("./routes/Post");

//using Routes

app.use("/api/v1",User);
app.use("/api/v1",Post);

module.exports=app