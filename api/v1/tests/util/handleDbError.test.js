import { describe, it, expect, beforeAll, afterAll, beforeEach, jest }
    from '@jest/globals'
import handleDbError from '../../util/handleDbError.js'

describe('handleDbError', () => {
    let response

    const runTest = (errorInput, expectedStatus, expectedMessages) => {
        handleDbError(response, errorInput)
        expect(response.status).toHaveBeenCalledWith(expectedStatus)
        expect(response.json).toHaveBeenCalledWith(expectedMessages)
    }

    beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))

    beforeEach(() => {
        response = {}
        response.status = jest.fn().mockReturnValue(response)
        response.json = jest.fn().mockReturnValue(response)
    })

    afterAll(() => console.error.mockRestore())

    it('returns 400 and [error message] when message includes "taken"', () => {
        runTest(
            { message: 'Username taken' },
            400,
            ['Username taken']
        )
    })

    it('returns 400 and [error messages] for ValidationError', () => {
        runTest(
            {
                name: 'ValidationError',
                errors: {
                    field1: { message: 'Username required' },
                    field2: { message: 'Email required' }
                }
            },
            400,
            ['Username required', 'Email required']
        )
    })

    it('returns 400 and invalid ID format message for CastError', () => {
        runTest(
            { name: 'CastError', value: '123a' },
            400,
            ['Invalid ID format: 123a']
        )
    })

    it('returns 500 and unexpected error message for unknown errors', () => {
        runTest(
            { message: 'Something went wrong' },
            500,
            ['Unexpected error']
        )
    })
})
