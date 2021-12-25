require('dotenv').config()
require('express-async-errors')
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express')
const { Query } = require('pg/lib/client')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

app.get('/api', async (req, res) => {
  const notes = await sequelize.query('select * from notes;', {
    type: QueryTypes.SELECT,
  })
  res.send(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
