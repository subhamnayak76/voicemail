import express from 'express'
import authRoutes from './routes/routes'

const app = express()

const PORT = 3001

app.use(express.json())

app.get("/",(req,res) =>{
    res.send("vociemail backend is running ")
})

app.use('/api/auth/',authRoutes)
app.listen(PORT ,() =>{
    console.log("serving in the port 3001")
})