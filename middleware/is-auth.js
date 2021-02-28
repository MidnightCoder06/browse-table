const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // check if the incoming request has an auth header attached to it
  const authHeader = req.get('Authorization');
  // if not, assign it a new property called isAuth and set it to false
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  // const token = authHeader.split(' ')[1];
  // if (!token || token === '') {
  //   req.isAuth = false;
  //   return next();
  // }
  // let decodedToken;
  // try {
  //   decodedToken = jwt.verify(token, 'somesupersecretkey');
  // } catch (err) {
  //   req.isAuth = false;
  //   return next();
  // }
  // if (!decodedToken) {
  //   req.isAuth = false;
  //   return next();
  // }
  // req.isAuth = true;
  // req.userId = decodedToken.userId;
  // next();
};
