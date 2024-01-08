import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.headers.authorization || '';

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded._id;

      next();
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        isSuccess: false,
        data: {},
        info: {
          message: 'Access denied',
          details: null
        }
      });
    }
  } else {
    return res.status(403).json({
      isSuccess: false,
      data: {},
      info: {
        message: 'Access denied',
        details: null
      }
    });
  }
} 