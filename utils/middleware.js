const error = (err, req, res, next) => {
  console.log(err.name)
  if (err.name === 'Error') {
    res.status(401).send({ error: 'please relogin?!??' })
  }
  if (err.name === 'JsonWebTokenError') {
    res.status(401).send({ error: 'not authorized, jwt' })
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(400).send({ error: 'Something is not unique' })
  }
  if (err.name === 'SequelizeDatabaseError') {
    res
      .status(400)
      .send({ error: 'Something might be wrong with your parameters' })
  }
  if (err.name === 'SequelizeValidationError') {
    res
      .status(400)
      .send({ error: 'Your data didnt pass the validation for the schema' })
  }
  next(err)
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

const tokenExtract = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.body.token = authorization.substring(7)
  } else {
    req.body.token = null
  }
  next()
}

module.exports = { unknownEndpoint, error, tokenExtract }
