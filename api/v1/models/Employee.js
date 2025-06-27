import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name required'],
            match: [
                /^[A-Za-zÀ-ÿ ''-]{1,100}$/,
                'First name can be a maximum of 100 characters and can ' +
                'contain only letters, apostrophes, hyphens, and spaces ' +
                'between words'
            ]
        },
        lastName: {
            type: String,
            required: [true, 'Last name required'],
            match: [
                /^[A-Za-zÀ-ÿ ''-]{1,100}$/,
                'Last name can be a maximum of 100 characters and can ' +
                'contain only letters, apostrophes, hyphens, and spaces ' +
                'between words'
            ]
        },
        title: {
            type: String,
            required: [true, 'Job title required'],
            match: [
                /^[A-Za-zÀ-ÿ ''-]{1,100}$/,
                'Job title can be a maximum of 100 characters and can ' +
                'contain only letters, apostrophes, hyphens, and spaces ' +
                'between words'
            ]
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: [true, 'Department required'],
            validate: {
                validator: async value => {
                    const department =
                        await mongoose.model('Department').findById(value)
                    return department !== null
                },
                message: 'Invalid department'
            }
        },
        email: {
            type: String,
            required: [true, 'Email address required'],
            unique: [true, 'Email address taken'],
            match: [
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                'Email address must have a valid format'
            ]
        },
        countryCode: {
            type: String,
            required: [true, 'Country code required'],
            match: [
                /^[0-9]{1,4}$/,
                'Country code must be between 1 and 4 digits and contain ' +
                'only digits'
            ]
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number required'],
            match: [
                /^[0-9]{7,15}$/,
                'Phone number must be between 7 and 15 digits and contain ' +
                'only digits'
            ]
        },
        isActive: {
            type: Boolean,
            default: true,
            message: 'Active status must be true or false'
        },
        hireDate: {
            type: Date,
            required: [true, 'Hire date required']
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Employee', employeeSchema)
