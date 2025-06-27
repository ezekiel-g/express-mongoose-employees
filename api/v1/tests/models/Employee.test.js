import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import Employee from '../../models/Employee.js'

describe('Employee', () => {
    let employeeData

    const shouldFail = async (field, badValues = []) => {
        for (let i = 0; i < badValues.length; i++) {
            employeeData[field] = badValues[i]
            const newEmployee = new Employee(employeeData)

            await expect(
                newEmployee.validate({ pathsToSkip: ['departmentId'] })
            ).rejects.toThrowError()
        }
    }

    beforeEach(async () => {
        employeeData = {
            firstName: 'Michael',
            lastName: 'Smith',
            title: 'Manager',
            departmentId: null,
            email: 'michael.smith@example.com',
            countryCode: '1',
            phoneNumber: '1234567890',
            isActive: true,
            hireDate: '2022-01-30'
        }
    })

    afterEach(() => jest.clearAllMocks())

    it('allows creat/update if input is validated successfully', async () => {
        const newEmployee = new Employee(employeeData)

        await expect(
            newEmployee.validate({ pathsToSkip: ['departmentId'] })
        ).resolves.not.toThrow()
    })    

    it('validates first name format correctly', async () => {
        await shouldFail(
            'firstName',
            ['Mich&el','Mich@el', 'M'.repeat(101), '', null]
        )
    })

    it('validates last name format correctly', async () => {
        await shouldFail(
            'lastName',
            ['Smith%', 'Smith#', 'S'.repeat(101), '', null]
        )
    })

    it('validates title format correctly', async () => {
        await shouldFail(
            'title',
            ['Manager*', 'Manager^', 'M'.repeat(101), '', null]
        )
    })

    it('validates email format correctly', async () => {
        await shouldFail(
            'email',
            [
                'michael.smith&example.com',
                'michael.smith@examplecom',
                'michael&smith@example.com',
                '',
                null
            ]
        )
    })

    it('validates country code format correctly', async () => {
        await shouldFail('countryCode', ['+1', '}', '11111', '', null])
    })

    it('validates phone number format correctly', async () => {
        await shouldFail('phoneNumber', ['1111', '}', '1'.repeat(16), '', null])
    })

    it('validates hire date correctly', async () => {
        await shouldFail('hireDate', ['kangaroo', 'non-date', '', null])
    })
})
