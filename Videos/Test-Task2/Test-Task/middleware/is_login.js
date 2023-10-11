const jwt=require('jsonwebtoken');
const is_login =async (req, res, next) =>  {
    const token = req.session.token;
  
    if (!token) {
      return res.redirect('/user/registerLoad');
    }
  
    jwt.verify(token,process.env.SEC_KEY, (err, user) => {
      if (err) {
        // Handle token verification errors (e.g., token expired)
        return res.redirect('/user/registerLoad');
      }
  
      // Store the user information in the request object
      req.user = user;
      console.log(req.user)
      next();
    });
  }
module.exports = { is_login }