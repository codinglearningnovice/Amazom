const jwt = require("jsonwebtoken");
require("dotenv").config();






const verifyJWT = (req, res, next) => {
  
  console.log("Cookies:", req.cookies);
  console.log("Authorization Header:", req.headers.authorization);
  
  

  // Extract token headers
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
    
  
  /*const decoded = jwt.decode(token);
  console.log("Decoded Token:", decoded);
  console.log("Token Expiration:", new Date(decoded.exp * 1000));

  console.log("Extracted Token:", token);
 
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //console.log("Valid Token Data:", decoded);
  } catch (err) {
    console.log("Error Verifying JWT:",err);
  }*/

 if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
console.log(accessToken); 
//console.log(`"env:", ${process.env.ACCESS_TOKEN_SECRET}`); 
try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT Verification Error:", err);
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid or expired accesstoken" });
      }

      console.log("Decoded Token Data:", decoded.UserInfo);

      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;

      next();
    });
} catch (error) {
      console.error("Token verification failed:", error);
      return res.sendStatus(403);
  };
};




module.exports = verifyJWT