const errorHandler = (err, req, res, next) => {
    if (err.name === 'SequelizeValidationError') {
        const usernameError = err.errors.find(e => e.validatorName === 'isEmail')
        if (usernameError) {
          return res.status(400).json({
            error: 'Username must be an email address'
          })
        }
        
        return res.status(400).json({
          error: err.errors.map(e => e.message)
        })

    } else if (err.name === 'NotFoundError') {
        return res.status(404).json({
            error: 'Blog or user not found'
        })

    } else {
        return res.status(500).json({
            error: 'Internal server error: ' + err.message
        })
    }
}

module.exports = errorHandler