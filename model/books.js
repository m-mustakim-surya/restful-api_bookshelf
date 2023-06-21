const mongoose = require('mongoose')

const Books = mongoose.model('Books', {
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  readPage: {
    type: Number,
    required: true
  },
  finished: {
    type: Boolean,
    required: true
  },
  reading: {
    type: Boolean,
    required: true
  },
  insertedAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
})

module.exports = Books
