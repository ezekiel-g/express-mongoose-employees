import express from 'express'
import handleDbError from '../util/handleDbError.js'

const createCrudRouter = model => {
    const router = express.Router()

    router.get('/', async (request, response) => {
        try {
            const documents = await model.find()

            return response.status(200).json(documents)
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    router.get('/:id', async (request, response) => {
        try {
            const document = await model.findById(request.params.id)

            if (!document) return response.status(404).json([])

            return response.status(200).json([document])
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    router.post('/', async (request, response) => {
        try {
            const newDocument = new model(request.body)
            const savedDocument = await newDocument.save()

            return response.status(201).json([savedDocument])
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    router.patch('/:id', async (request, response) => {
        try {
            const updatedDocument = await model.findByIdAndUpdate(
                request.params.id,
                { $set: request.body },
                { new: true, runValidators: true }
            )

            if (!updatedDocument) return response.status(404).json([])

            return response.status(200).json([updatedDocument])
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    router.delete('/:id', async (request, response) => {
        try {
            const deletedDocument =
                await model.findByIdAndDelete(request.params.id)

            if (!deletedDocument) return response.status(404).json([])

            return response.status(200).json([])
        } catch (error) {
            return handleDbError(response, error)
        }
    })

    return router
}

export default createCrudRouter
