const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

exports.connectDatabase=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((con)=>{console.log(`Database Connection established: ${con.connection.host}`)})
    .catch((error)=>{console.log(err)});
}
