import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if(!token) {
    return res.status(403).json({ message :"Cần có token để xác thực người dùng"});
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send("Token không hợp lệ");
  }

  return next();
}

export default verifyToken;