const express = require("express")
const router = express.Router()
const { Book } = require("../db")
const cloudinary = require("../cloudinary-config")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// config multer storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book-management',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({ storage: storage})


// get all books
router.get("/", async(req, res)=> {
    try{
        const books = await Book.find({ isEnable: true})
        res.status(200).json(books)
    }
    catch (error){
        res.status(400).json({message: "Error fetching books", error})
    }
})

// show form create book
router.get("/create", (req, res) => res.render(''))

// show form update book
router.get("update/:id", async(req, res) => {
    try{
        const bookId = req.params.id
        const book = await Book.findOne({ id: bookId , isEnable: true});
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Fail to get book', error });
    }
})

// get book by id
router.get('/:id', async (req, res) => {
    try {
        const bookId = req.params.id
        const book = await Book.findOne({ id : bookId, isEnable: true});
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Fail to get book', error });
    }
});

// create new book
router.post("/store", upload.single('image'),async(req, res) => {
    try{
        const bookData = {
            ...req.body,
            imgUrl: req.file.path,
            isEnable : true
        }
        const book =  new Book(bookData)
        const result = await book.save()
        res.status(200).json(result);
    }
    catch (error){
        res.status(400).json({ message: 'Error creating book', error })
    }
})


// update book
router.put("/save/:id", upload.single('image'),async(req, res) => {
    try{
        const updatedData  = {
            ...req.body,
            imgUrl: req.file ? req.file.path : req.body.imgUrl
        }
        const updatedBook = await Book.findOneAndUpdate({id: req.params.id}, updatedData, {new : true})

        if (!updatedBook) {
            return res.status(404).send({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    }
    catch (error){
        res.status(400).json({ message: 'Error updating book', error })
    }
})

// delete book
router.delete("/delete/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );

        if (!updatedBook) {
            return res.status(404).send({ message: 'Book not found' });
        }

        res.status(200).json({
            message: 'Book marked as disabled (isEnable: false)',
            updatedBook
        });
    } catch (error) {
        res.status(400).json({ message: 'Error updating book status', error });
    }
});

module.exports = router