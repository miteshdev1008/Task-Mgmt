const mon=require('mongoose');

mon.connect(process.env.MONGODB_URI)
.then(()=>{console.log("app is connected with db")})
.catch((e)=>{console.log("app is failed to connect with db"+e.toString())});