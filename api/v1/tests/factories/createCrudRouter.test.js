import { describe, it, expect, afterEach, beforeEach, jest }
    from '@jest/globals'
import request from 'supertest'
import express from 'express'
import createCrudRouter from '../../factories/createCrudRouter.js'
import handleDbError from '../../util/handleDbError.js'

jest.mock('../../util/handleDbError.js')

describe('createCrudRouter', () => {
    let app
    let model

    beforeEach(() => {
        model = jest.fn()
        model.find = jest.fn()
        model.findById = jest.fn()
        model.findByIdAndUpdate = jest.fn()
        model.findByIdAndDelete = jest.fn()

        app = express()
        app.use(express.json())
        app.use('/api/v1/users', createCrudRouter(model))

        handleDbError.mockImplementation((response, error) => {
            response.status(500).json({ error: error.message })
        })
    })

    afterEach(() => jest.clearAllMocks())

    it('handles GET /', async () => {
        const mockDocuments = [{ name: 'Michael' }, { name: 'Sarah' }]
        model.find.mockResolvedValue(mockDocuments)

        await request(app).get('/api/v1/users').expect(200)

        expect(model.find).toHaveBeenCalled()
        expect(model.find).toHaveBeenCalledWith()
    })

    it('handles GET /:id', async () => {
        const mockDocument = { name: 'Michael' }
        model.findById.mockResolvedValue(mockDocument)

        await request(app).get('/api/v1/users/1').expect(200)

        expect(model.findById).toHaveBeenCalledWith('1')
        expect(model.findById).toHaveBeenCalledTimes(1)
    })

    it('returns 404 when GET /:id document not found', async () => {
        model.findById.mockResolvedValue(null)

        await request(app).get('/api/v1/users/1').expect(404)

        expect(model.findById).toHaveBeenCalledWith('1')
        expect(model.findById).toHaveBeenCalledTimes(1)
    })

    it('handles POST /', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        const savedDocument = { _id: '1', name: 'Michael', city: 'New York' }

        const mockSave = jest.fn().mockResolvedValue(savedDocument)
        model.mockImplementation(() => ({ save: mockSave }))

        await request(app)
            .post('/api/v1/users')
            .send(requestBody)
            .expect(201)

        expect(mockSave).toHaveBeenCalledTimes(1)
    })

    it('handles PATCH /:id', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        const updatedDocument = { _id: '1', name: 'Michael', city: 'New York' }
        model.findByIdAndUpdate.mockResolvedValue(updatedDocument)

        await request(app)
            .patch('/api/v1/users/1')
            .send(requestBody)
            .expect(200)

        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            '1',
            { $set: requestBody },
            { new: true, runValidators: true }
        )
        expect(model.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })

    it('returns 404 when PATCH /:id document not found', async () => {
        const requestBody = { name: 'Michael', city: 'New York' }
        model.findByIdAndUpdate.mockResolvedValue(null)

        await request(app)
            .patch('/api/v1/users/1')
            .send(requestBody)
            .expect(404)

        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            '1',
            { $set: requestBody },
            { new: true, runValidators: true }
        )
        expect(model.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    })

    it('handles DELETE /:id', async () => {
        const deletedDocument = { _id: '1', name: 'Michael' }
        model.findByIdAndDelete.mockResolvedValue(deletedDocument)

        await request(app).delete('/api/v1/users/1').expect(200)

        expect(model.findByIdAndDelete).toHaveBeenCalledWith('1')
        expect(model.findByIdAndDelete).toHaveBeenCalledTimes(1)
    })

    it('returns 404 when DELETE /:id document not found', async () => {
        model.findByIdAndDelete.mockResolvedValue(null)

        await request(app).delete('/api/v1/users/1').expect(404)

        expect(model.findByIdAndDelete).toHaveBeenCalledWith('1')
        expect(model.findByIdAndDelete).toHaveBeenCalledTimes(1)
    })
})
