const handleDbError = (response, error) => {
    if (error.message && error.message.includes('taken')) {
        return response.status(400).json([error.message])
    }

    if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(e => {
            if (e.message.includes('Cast to date')) {
                return 'Date format invalid'
            } else {
                return e.message
            }
        })

        return response.status(400).json(validationErrors)
    }

    if (error.name === 'CastError') {
        return response.status(400).json([`Invalid ID format: ${error.value}`])
    }

    if (error.name === 'MongoError') {
        return response.status(500).json([`Database error: ${error.message}`])
    }

    return response.status(500).json([`Unexpected error: ${error.message}`])
}

export default handleDbError
