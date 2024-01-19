const jwt = require("jsonwebtoken");

module.exports =  async(Id) =>{
    const SECRET_KEY = "c4d6f5a7b3e2a1f8e5d2c3a9b6d7e1f4a2b3d6e9f5c8a7b2d4f1e3c5a6b9"
      // Create a token with the user's ID
    const token = await jwt.sign(Id , SECRET_KEY, { expiresIn: '1h' });
  
    return token;
}
