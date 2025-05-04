const errorHandler = (err, req, res, next) => {
    console.error("ERROR: ", err)
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: err.errors.map(e => e.message)
        })
    } else if (err.name === 'NotFoundError') {
        return res.status(404).json({
            error: 'Blog not found'
        })
    } else {
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}

module.exports = errorHandler