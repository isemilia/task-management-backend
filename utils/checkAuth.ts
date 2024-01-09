import jwt from 'jsonwebtoken';
import express from 'express'


export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization || '';

  if(process.env.JWT_SECRET === undefined){
    throw Error("DATABASE_URI")
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if(typeof decoded === 'string'){
        next(decoded)
      }

      req.userId = (decoded as any)._id;

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
