const router = require('express').Router()
const { Blog } = require('../models/index')
const { sequelize } = require('../utils/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: sequelize.col('author'),
    order: [[sequelize.literal('likes DESC')]],
  })
  res.send(authors)
})

module.exports = router
