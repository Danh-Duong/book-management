const express = require("express")
const router = express.Router()
const { Author } = require("../db")
const authenticateToken = require("../authenticateToken")
const { formatDateToDDMMYYYY } = require("../utils/Utils");

router.use(authenticateToken);

// get author page filter
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 5; 
        const valueSearch = req.query.valueSearch;
        const isEnable = (req.query.isEnable ?? "true") === "true";

        const filter = {isEnable}
        if (valueSearch){
            filter.$or = [
                { id: valueSearch },
                { name: new RegExp(valueSearch, 'i') }
            ];
        }   
        
        const skip = (page - 1) * limit;
        const authors = await Author.find(filter) 
            .skip(skip)
            .limit(limit);

        const formattedAuthors = authors.map(author => {
            const authorObj = author.toObject();
            authorObj.birthDate = formatDateToDDMMYYYY(authorObj.birthDate);
            return authorObj;
        });

        const totalAuthors = await Author.countDocuments(filter);
        const totalPages = Math.ceil(totalAuthors / limit);

        res.render("admin/manage_author",{
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalAuthors,
            authors: formattedAuthors,
            valueSearch: valueSearch,
            error: null
        })
    } catch (error) {
        console.error("Error occurred:", error.stack);
    }
});

// show form create author
router.get("/create", (req, res) => {
    res.render('admin/save_author',{action: "add", error: null, data: {
        id: "",
        name: "",
        desc: "",
        birthDate: "",
        nationality: "",
        bio: ""
    }})
})

// show form update author
router.get("/update/:id", async(req, res) => {
    try{
        const authorId = req.params.id
        const author = await Author.findOne({ id: authorId , isEnable: true});

        const formattedAuthor = {
            ...author.toObject(),
            birthDate: author.birthDate.toISOString().split('T')[0],
        };

        if (author)
            res.render("admin/save_author",{action: '', error: null, data: formattedAuthor})
        
    } catch (error) {
        res.status(400).json({ message: 'Fail to get author', error });
    }
})

// create new author
router.post("/store", async(req, res) => {
    try{
        const existedAuthor = await Author.findOne({id: req.body.id})
        if (existedAuthor){
            return res.render("admin/save_author", {
                error: "ID đã tồn tại. Vui lòng sử dụng ID khác!",
                data: req.body,
                action: 'add',
            })
        }

        const author =  new Author(req.body)
        await author.save()
        return res.redirect("/admin/authors")
    }
    catch (error){
        res.status(400).json({ message: 'Error creating author', error })
    }
})

// update author
router.post("/save/:id", async(req, res) => {
    try{
        const updatedAuthor = await Author.findOneAndUpdate({id: req.params.id}, req.body, {new : true})

        if (!updatedAuthor) {
            return res.render("admin/manage_author", {error: "Không thể cập nhập Category"})
        }
        return res.redirect("/admin/authors")
    }
    catch (error){
        res.status(400).json({ message: 'Error updating author', error })
    }
})

// delete author
router.get("/delete/:id", async (req, res) => {
    try {
        const deletedAuthor = await Author.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );

        if (!deletedAuthor) {
            return res.render("admin/manage_author", {error: "Không thể xóa author này!"})
        }

        return res.redirect("/admin/authors")
    } catch (error) {
        res.status(400).json({ message: 'Error deleting author', error });
    }
});

module.exports = router