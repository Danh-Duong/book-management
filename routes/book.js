const express = require("express")
const router = express.Router()
const { Book, Author, Category } = require("../db")
const cloudinary = require("../cloudinary-config")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const authenticateToken = require("../authenticateToken")

// config multer storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book-management',
    }
});

const upload = multer({ storage: storage})

router.get("/id/:id", async(req,res)=>{
    const bookId = req.params.id
    const book = await Book.findOne({id: bookId});
    const category = await Category.findOne({ id: book.id_category });
    const author = await Author.findOne({ id: book.id_author });
    const data = {
        ...book.toObject(),
        category,
        author,
    }
    res.json(data)
})

// get book page filter
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 5; 
        const valueSearch = req.query.valueSearch;
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        const id_category = req.query.id_category;
        const id_author = req.query.id_author;
        const isEnable = (req.query.isEnable ?? "true") === "true";

        const filter = {isEnable}
        if (valueSearch){
            filter.$or = [
                { id: valueSearch },
                { name: new RegExp(valueSearch, 'i') }
            ];
        }  
        filter.price = {};
        filter.price.$gte = minPrice;
        filter.price.$lte = maxPrice;
        if (id_category && id_category!=='') filter.id_category = id_category;
        if (id_author && id_author!=='') filter.id_author = id_author;

        const skip = (page - 1) * limit;

        const books = await Book.find(filter) 
            .skip(skip)
            .limit(limit);
        
        const totalBooks = await Book.countDocuments(filter);
        const totalPages = Math.ceil(totalBooks / limit);
        const authors = await Author.find({isEnable: true})
        const categories = await Category.find({isEnable: true})

        res.render("admin/manage_book",{
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalBooks,
            books: books,
            valueSearch: valueSearch,
            minPrice: minPrice === 0 ? '': minPrice,
            maxPrice: maxPrice === Number.MAX_SAFE_INTEGER ? '':  maxPrice,
            id_author: id_author,
            id_category: id_category,
            authors: authors,
            categories: categories
        })
    } catch (error) {
        console.error("Error occurred:", error.stack);
    }
});

router.use(authenticateToken);

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
        const deletedBook = await Book.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );

        if (!deletedBook) {
            return res.status(404).send({ message: 'Book not found' });
        }

        res.status(200).json({
            message: 'Book marked as disabled (isEnable: false)',
            updatedBook
        });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting book', error });
    }
});

module.exports = router