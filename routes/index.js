var express = require('express');
var router = express.Router();
const { Book, Author, Category } = require("../db")
const { formatDateToDDMMYYYY } = require("../utils/Utils");

router.get("/books/:id", async (req, res) => {
  const bookId = req.params.id
  const book = await Book.findOne({ id: bookId });
  const category = await Category.findOne({ id: book.id_category });
  const author = await Author.findOne({ id: book.id_author });

  const formattedBook = book.toObject();
  formattedBook.createdAt = formatDateToDDMMYYYY(book.createdAt);

  const relatedBooks = await Book.find({ id_category: book.id_category, _id: { $ne: book._id }});

  const data = {
    ...formattedBook,
    category,
    author,
  }
  // res.json(data)
  res.render("detail_book", { data: data, relatedBooks: relatedBooks })
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  const books = await Book.find({isEnable: true})
  res.render("index", {
    books: books,
  })
});

module.exports = router;
