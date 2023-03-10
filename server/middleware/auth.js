const jwt = require('jsonwebtoken');
const User = require("../Model/UserModel");
const isAuthenticatedUser=async(req,res,next)=>{

    try {
        
        //getting token from cookie
       
        const {token} =req.cookies;
        
        
    //if token not found mean user not login     
      if(!token){
        res.status(401).json({
            success: false,
            message:"Please Login To Access The Resource",
          });
      }else{
     

      //now verifty token is correct or not
      //we have a key from which we generate a tocken correspond  to each _id 
      //why use _id because id is unique for each user then token also we unique for each user
      const decodeData = jwt.verify(token,process.env.JWT_SCRIET);

       req.user=await User.findById(decodeData.id);
       next();}

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
          });
    }
}

module.exports=isAuthenticatedUser;