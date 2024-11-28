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
            limit: limit,
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
router.get("/create", async (req, res) => {
    const categories = await Category.find({isEnable: true})
    const authors = await Author.find({isEnable: true})
    res.render('admin/save_book',
        {
            error: null, 
            categories: categories,
            authors: authors, 
            action: "add",
            data: {
                id: "",
                desc: "",
                numb: "",
                price: "",
                publisher: "",
                yearPublication: "",
                id_category: "",
                id_author: "",
            }  
        }
    )})

// show form update book
router.get("/update/:id", async(req, res) => {
    try{
        const bookId = req.params.id
        const book = await Book.findOne({ id: bookId , isEnable: true});
        const categories = await Category.find({isEnable: true})
        const authors = await Author.find({isEnable: true})
        if (book) {
            res.render('admin/save_book',
                {
                    error: null, 
                    categories: categories,
                    authors: authors, 
                    data: book,
                    action: ""
                }
        )}
        } 
    catch (error) {
        res.status(400).json({ message: 'Fail to get book', error });
    }
})

// create new book
router.post("/store", upload.single('image'),async(req, res) => {
    try{
        const existedBook = await Book.findOne({ id: req.body.id})
        const categories = await Category.find({ isEnable: true})
        const authors = await Author.find({isEnable: true})
        if (existedBook){
            return res.render("admin/save_book", { error: "ID đã tồn tại!", 
                data: req.body,
                categories: categories,
                authors: authors,
                action: "add"
            })
        }

        const bookData = {
            ...req.body,
            imgUrl: req?.file?.path,
            isEnable : true
        }
        
        const book = new Book(bookData)
        await book.save()
        return res.redirect("/admin/books")
    }
    catch (error){
        console.error('Error creating book:', error.stack);
        res.status(400).json({ message: 'Error creating book', error: error.message }); 
    }
})

// update book
router.post("/save/:id", upload.single('image'),async(req, res) => {
    try{
        const updatedData  = {
            ...req.body,
        }
        if (req.file) {
            updatedData.imgUrl = req.file.path;
        }
        const updatedBook = await Book.findOneAndUpdate({id: req.params.id}, updatedData, {new : true})

        if (!updatedBook) {
            return res.render("admin/manage_book", {error: "Không thể cập nhập thông tin sách"})
        }
        return res.redirect("/admin/books")
    }
    catch (error){
        res.status(400).json({ message: 'Error updating book', error })
    }
})

// delete book
router.get("/delete/:id", async (req, res) => {
    try {
        await Book.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );
        res.redirect("/admin/books")
    } catch (error) {
        res.status(400).json({ message: 'Error deleting book', error });
    }
});

module.exports = router