const handleDbError = (response, error) => {
    let statusCode = 500
    let message = 'Unexpected error'

    if (error.message?.includes('taken')) {
        statusCode = 400
        message = error.message
    }

    else if (error.name === 'ValidationError') {
        const validationMessages = Object.values(error.errors).map(e =>
            e.message.includes('Cast to date')
                ? 'Date format invalid'
                : e.message
        )
        return response.status(400).json(validationMessages)
    }

    else if (error.name === 'CastError') {
        statusCode = 400
        message = `Invalid ID format: ${error.value}`
    }

    console.error('Error:', error.message)

    if (error.stack) console.error(error.stack)

    return response.status(statusCode).json([message])
}

export default handleDbError
