import { describe, it, expect, beforeEach, afterEach, jest }
    from '@jest/globals'
import Department from '../../models/Department.js'

describe('Department', () => {
    let departmentData

    const shouldFail = async (field, badValues = []) => {
        for (let i = 0; i < badValues.length; i++) {
            departmentData[field] = badValues[i]
            const newEmployee = new Department(departmentData)

            await expect(newEmployee.validate()).rejects.toThrowError()
        }
    }

    beforeEach(() => {
        departmentData = { name: 'IT', code: 'IT1', location: 'New York' }
    })

    afterEach(() => jest.clearAllMocks())

    it('allows creat/update if input is validated successfully', async () => {
        const newDepartment = new Department(departmentData)

        await expect(newDepartment.validate()).resolves.not.toThrow()
    })    

    it('validates name format correctly', async () => {
        await shouldFail('name', ['IT&', '}', 'I'.repeat(101), '', null])
    })

    it('validates code format correctly', async () => {
        await shouldFail('code', ['it', 'IT@', 'I'.repeat(21), '', null])
    }) 

    it('validates location correctly', async () => {
        await shouldFail('location', ['Chicago', 'Ur', '', null])
    })
})
