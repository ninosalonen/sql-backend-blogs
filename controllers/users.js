const router = require('express').Router()
const { User, Blog } = require('../models/index')
const { SECRET } = require('../utils/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
    attributes: ['id', 'name', 'username'],
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const body = req.body
  const salt = 10
  const hashedPass = await bcrypt.hash(body.password, salt)
  const newUser = {
    username: body.username,
    name: body.name,
    password: hashedPass,
  }
  const user = await User.create(newUser)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = jwt.verify(req.body.token, SECRET)
  if (req.params.username !== user.username) {
    res.status(401).json({ error: 'not authorized to change' })
  }
  const updated = await User.update(
    { username: req.body.username },
    {
      where: {
        username: req.params.username,
      },
    }
  )
  res.send(updated)
})

module.exports = router
