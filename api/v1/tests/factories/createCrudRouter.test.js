import { describe, it, expect, beforeAll, afterAll, afterEach, jest }
    from '@jest/globals'
import request from 'supertest'
import express from 'express'
import createCrudRouter from '../../factories/createCrudRouter.js'
import handleDbError from '../../util/handleDbError.js'

jest.mock('../../util/handleDbError.js')

describe('createCrudRouter', () => {
    let app
    let model

    beforeAll(() => {
        model = jest.fn()
        model.find = jest.fn()
        model.findById = jest.fn()
        model.findByIdAndUpdate = jest.fn()
        model.findByIdAndDelete = jest.fn()

        app = express()
        app.use(express.json())
        app.use('/api/v1/users', createCrudRouter(model))

        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(() => console.error.mockRestore())

    it('returns 200 and all documents on GET /', async () => {
        const mockDocuments = [{ name: 'Michael' }, { name: 'Sarah' }]
        model.find.mockResolvedValue(mockDocuments)

        const response = await request(app).get('/api/v1/users')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockDocuments)
        expect(model.find).toHaveBeenCalledWith()
    })

    it('returns 200 and specific document on GET /:id', async () => {
        const mockDocument = { name: 'Michael' }
        model.findById.mockResolvedValue(mockDocument)

        const response = await request(app).get('/api/v1/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([mockDocument])
        expect(model.findById).toHaveBeenCalledWith('1')
    })

    it('returns 404 when no document found on GET /:id', async () => {
        model.findById.mockResolvedValue(null)

        const response = await request(app).get('/api/v1/users/1')

        expect(response.status).toBe(404)
        expect(response.body).toEqual([])
        expect(model.findById).toHaveBeenCalledWith('1')
    })

    it('returns 201 and new document on POST /', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        const savedDocument = { _id: '1', name: 'Michael', city: 'New York' }

        const mockSave = jest.fn().mockResolvedValue(savedDocument)
        model.mockImplementation(() => ({ save: mockSave }))

        const response = await request(app)
            .post('/api/v1/users')
            .send(requestBody)

        expect(response.status).toBe(201)
        expect(response.body).toEqual([savedDocument])
        expect(mockSave).toHaveBeenCalled()
    })

    it('returns 200 and updated document on PATCH /:id', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        const updatedDocument = { _id: '1', name: 'Michael', city: 'New York' }
        model.findByIdAndUpdate.mockResolvedValue(updatedDocument)

        const response = await request(app)
            .patch('/api/v1/users/1')
            .send(requestBody)

        expect(response.status).toBe(200)
        expect(response.body).toEqual([updatedDocument])
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            '1',
            { $set: requestBody },
            { new: true, runValidators: true }
        )
    })

    it('returns 404 when no document found on PATCH /:id', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        model.findByIdAndUpdate.mockResolvedValue(null)

        const response = await request(app)
            .patch('/api/v1/users/1')
            .send(requestBody)

        expect(response.status).toBe(404)
        expect(response.body).toEqual([])
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            '1',
            { $set: requestBody },
            { new: true, runValidators: true }
        )
    })

    it('returns 200 and deletes document on DELETE /:id', async () => {
        const deletedDocument = { _id: '1', name: 'Michael' }
        model.findByIdAndDelete.mockResolvedValue(deletedDocument)

        const response = await request(app).delete('/api/v1/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
        expect(model.findByIdAndDelete).toHaveBeenCalledWith('1')
    })

    it('returns 404 when no document found on DELETE /:id', async () => {
        model.findByIdAndDelete.mockResolvedValue(null)

        const response = await request(app).delete('/api/v1/users/1')

        expect(response.status).toBe(404)
        expect(response.body).toEqual([])
        expect(model.findByIdAndDelete).toHaveBeenCalledWith('1')
    })

    it('calls handleDbError on GET / failure', async () => {
        const error = new Error()

        model.find.mockRejectedValueOnce(error)

        handleDbError.mockImplementation(
            response => response.status(500).json({ error: error.message })
        )

        await request(app).get('/api/v1/users')

        expect(handleDbError).toHaveBeenCalledWith(expect.any(Object), error)
    })
})
