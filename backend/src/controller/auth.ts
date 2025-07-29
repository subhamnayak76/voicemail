import {Request,Response} from 'express'

import prisma from '../lib/prisma'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const signup = async (req:Request,res:Response) => {

    
    const {name,email,password} = req.body
    console.log(name,email,password)
    const existinguser = await prisma.user.findUnique({where :{email}}
    )

    if(existinguser){
        return res.status(400).json({message:'Email already in use'})
    }
    const hashpass = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data : {
            name,
            email,
            password:hashpass
        }
    })

    return res.status(201).json({message:"user created",userId :user.id})
}


export const login = async (req:Request ,res:Response) => {
    const {email,password} = req.body

    const user = await prisma.user.findUnique({where : {
        email
    }})

    if (!user) {
        return res.status(401).json({"message":"invalid credintials"})
    }
    const isvalid = await bcrypt.compare(password,user.password)

    if (!isvalid){
        return res.status(401).json({message:'invalid credintials'})
    }

    if (!JWT_SECRET) {
        return res.status(500).json({message: 'Server configuration error'})
    }
    
    const token = jwt.sign({userId :user.id},JWT_SECRET,{expiresIn:'1h'})

    res.status(200).json({token})



}