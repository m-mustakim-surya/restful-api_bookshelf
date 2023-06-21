const { nanoid } = require('nanoid')
require('../utils/db')
const Books = require('../model/books')

const insertBookHandler = async (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = (pageCount === readPage)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = new Books({
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  })

  try {
    await newBook.save()

    const isInputted = await Books.findOne({ id })
    if (isInputted) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)
      return response
    }
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku'
    })
    response.code(500)
    return response
  }
}

const getAllBooksHandler = async (request, h) => {
  const { name, reading, finished } = request.query

  try {
    if (name) {
      const booksName = await Books.find({ name: { $regex: name, $options: 'i' } })

      return {
        status: 'success',
        data: {
          books: booksName.map(({ id, name, publisher }) => ({ id, name, publisher }))
        }
      }
    } else if (reading) {
      let booksReading
      if (reading === '0') {
        booksReading = await Books.find({ reading: false })
      } else if (reading === '1') {
        booksReading = await Books.find({ reading: true })
      }

      return {
        status: 'success',
        data: {
          books: booksReading.map(({ id, name, publisher }) => ({ id, name, publisher }))
        }
      }
    } else if (finished) {
      let booksFinished
      if (finished === '0') {
        booksFinished = await Books.find({ finished: false })
      } else if (finished === '1') {
        booksFinished = await Books.find({ finished: true })
      }

      return {
        status: 'success',
        data: {
          books: booksFinished.map(({ id, name, publisher }) => ({ id, name, publisher }))
        }
      }
    }

    const books = await Books.find()
    return {
      status: 'success',
      data: {
        books: books.map(({ id, name, publisher }) => ({ id, name, publisher }))
      }
    }
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal melakukan fetch buku'
    })
    response.code(500)
    return response
  }
}

const getBookByIdHandler = async (request, h) => {
  const { bookId } = request.params

  try {
    const book = await Books.findOne({ id: bookId })

    if (book) {
      return {
        status: 'success',
        data: {
          book
        }
      }
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal melakukan fetch buku'
    })
    response.code(500)
    return response
  }
}

const editBookByIdHandler = async (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const updatedAt = new Date().toISOString()

  try {
    const updateBook = await Books.updateOne(
      { id: bookId },
      {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
      }
    )

    if (updateBook.modifiedCount === 1) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku'
    })
    response.code(500)
    return response
  }
}

const deleteBookByIdHandler = async (request, h) => {
  const { bookId } = request.params

  try {
    const deleteNote = await Books.deleteOne({ id: bookId })

    if (deleteNote.deletedCount === 1) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menghapus buku'
    })
    response.code(500)
    return response
  }
}

module.exports = { insertBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
