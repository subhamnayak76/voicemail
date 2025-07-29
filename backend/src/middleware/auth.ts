import {Request,Response,NextFunction} from 'express'

import jwt from "jsonwebtoken"

const JWT_SECRET= process.env.JWT_SECRET


interface JwtPayload {
    userId:string
}

export const authenticate = (req:Request,res:Response,next:NextFunction) => {
    const authheader= req.headers.authorization

    if (!authheader?.startsWith('Bearer')){
        return res.status(401).json({message:'unauthorized'})
    }

    const token = authheader.split(' ')[1]

    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Server configuration error' });
    }
   
  try {
    const payload = jwt.verify(token, JWT_SECRET)as JwtPayload
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}