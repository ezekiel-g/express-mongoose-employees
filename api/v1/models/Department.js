import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name required'],
            match: [
                /^[A-Za-z0-9 \-''.,]{1,100}$/,
                'Name can be maximum 100 characters and can contain only ' +
                'letters, numbers, spaces, hyphens, apostrophes and periods'
            ]
        },
        code: {
            type: String,
            required: [true, 'Code required'],
            unique: [true, 'Code taken'],
            match: [
                /^[A-Z0-9]{1,20}$/,
                'Code can be maximum 20 characters and can contain only ' +
                'numbers and capital letters'
            ]
        },
        location: {
            type: String,
            enum: {
                values: ['New York', 'San Francisco', 'London'],
                message: 'Location not currently valid'
            },
            required: [true, 'Location required']
        },
        isActive: {
            type: Boolean,
            default: true,
            message: 'Active status must be true or false'
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Department', departmentSchema)
