require('dotenv').config()
require('express-async-errors')
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
)

app.get('/', async (req, res) => {
  res.send('Welcome')
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.json(blog)
})

app.delete('/api/blogs/:id', async (req, res) => {
  const deleted = await Blog.destroy({
    where: {
      id: req.params.id,
    },
  })
  res.json(deleted)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
