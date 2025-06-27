import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import handleDbError from '../../util/handleDbError.js'

describe('handleDbError', () => {
    let response

    beforeEach(() => {
        response = {}
        response.status = jest.fn().mockReturnValue(response)
        response.json = jest.fn().mockReturnValue(response)
    })

    it('returns 400 and [error message] when message includes "taken"', () => {
        const error = { message: 'Username taken' }

        handleDbError(response, error)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith(['Username taken'])
    })

    it('returns 400 and [error messages] for ValidationError', () => {
        const error = {
            name: 'ValidationError',
            errors: {
                field1: { message: 'Username required' },
                field2: { message: 'Email required' }
            }
        }

        handleDbError(response, error)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith([
            'Username required',
            'Email required'
        ])
    })

    it('returns 400 and invalid ID format message for CastError', () => {
        const error = { name: 'CastError', value: '123a' }

        handleDbError(response, error)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith(['Invalid ID format: 123a'])
    })

    it('returns 500 and database error message for MongoError', () => {
        const error = { name: 'MongoError', message: 'text' }

        handleDbError(response, error)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith(['Database error: text'])
    })

    it('returns 500 and unexpected error message for unknown errors', () => {
        const error = { message: 'text' }
        
        handleDbError(response, error)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith(['Unexpected error: text'])
    })
})
