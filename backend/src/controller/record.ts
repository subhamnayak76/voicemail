import {Request,Response} from 'express'
import {GetObjectCommand,PutObjectCommand,S3Client} from "@aws-sdk/client-s3"

import {getSignedUrl} from "@aws-sdk/s3-request-presigner"

import {v4 as uuidv} from "uuid"


const s3 = new S3Client({
    region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const signedurl = async (req:Request,res:Response) => {
    const userId = req.user?.userId

    if (!userId){
        return res.status(401).json({message: 'Unauthorized'})
    }
    try {
        const fileName = `${userId}/${uuidv()}.wav`
        const putCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: fileName,
            ContentType: 'audio/wav',
        })

        const signedUrl = await getSignedUrl(s3, putCommand, { expiresIn: 3600 })
        
        res.status(200).json({ 
            signedUrl,
            fileName 
        })
    } catch (error) {
        console.error('Error generating signed URL:', error)
        res.status(500).json({ message: 'Failed to generate signed URL' })
    }
}