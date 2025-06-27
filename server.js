import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import createCrudRouter from './api/v1/factories/createCrudRouter.js'
import Department from './api/v1/models/Department.js'
import Employee from './api/v1/models/Employee.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const corsOptions = {
    origin: process.env.FRONT_END_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}

app.use(express.json())
app.use(cors(corsOptions))
app.use('/api/v1/departments', createCrudRouter(Department))
app.use('/api/v1/employees', createCrudRouter(Employee))

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log('Connected to MongoDB')

        app.listen(port, () => console.log(`Server running on port ${port}`))
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}

startServer()
