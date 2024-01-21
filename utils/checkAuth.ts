import jwt from 'jsonwebtoken';
import express, {NextFunction, Request, Response} from 'express'


export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || '';

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
        result: {},
        info: {
          message: 'Access denied',
          details: null
        }
      });
    }
  } else {
    return res.status(403).json({
      result: {},
      info: {
        message: 'Access denied',
        details: null
      }
    });
  }
}
