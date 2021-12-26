const router = require('express').Router()
const { User } = require('../models/index')
const { SECRET } = require('../utils/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  })
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(req.body.password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
