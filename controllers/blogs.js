const router = require('express').Router()
const { Blog, User } = require('../models/index')
const { SECRET } = require('../utils/config')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search,
          },
        },
        {
          author: {
            [Op.substring]: req.query.search,
          },
        },
      ],
    }
  }
  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    where,
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
  })
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const user = jwt.verify(req.body.token, SECRET)
  if (!user) {
    res.status(401).send({ error: 'please login to post a blog' })
  }
  const blog = await Blog.create({ ...req.body, userId: user.id })

  res.json(blog)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  res.json(blog)
})

router.delete('/:id', async (req, res) => {
  const user = jwt.verify(req.body.token, SECRET)
  const blogToDelete = await Blog.findByPk(req.params.id)
  if (blogToDelete.dataValues.userId !== user.id) {
    res.status(401).send({ error: 'not authorized to delete' })
  } else {
    const deleted = await Blog.destroy({
      where: {
        id: req.params.id,
      },
    })
    res.status(201).json(deleted)
  }
})

router.put('/:id', async (req, res) => {
  const likes = await Blog.update(
    { likes: req.body.likes },
    {
      where: {
        id: req.params.id,
      },
    }
  )
  res.send(likes)
})

module.exports = router
