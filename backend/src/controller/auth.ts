import {Request,Response} from 'express'

import prisma from '../lib/prisma'

import bcrypt from 'bcrypt'

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