const express = require("express")
const router = express.Router()
const { Author } = require("../db")
const authenticateToken = require("../authenticateToken")

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

        const totalAuthors = await Author.countDocuments(filter);
        const totalPages = Math.ceil(totalAuthors / limit);

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalAuthors: totalAuthors,
            authors: authors
        });
    } catch (error) {
        console.error("Error occurred:", error.stack);
        res.status(400).json({ message: 'Error fetching books', error });
    }
});

// show form create author
router.get("/create", (req, res) => res.render(''))

// show form update author
router.get("/update/:id", async(req, res) => {
    try{
        const authorId = req.params.id
        const author = await Author.findOne({ id: authorId , isEnable: true});
        if (author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Fail to get author', error });
    }
})

// create new author
router.post("/store", async(req, res) => {
    try{
        const author =  new Author(req.body)
        const result = await author.save()
        res.status(200).json(result);
    }
    catch (error){
        res.status(400).json({ message: 'Error creating author', error })
    }
})

// update author
router.put("/save/:id", async(req, res) => {
    try{
        const updatedAuthor = await Author.findOneAndUpdate({id: req.params.id}, req.body, {new : true})

        if (!updatedAuthor) {
            return res.status(404).send({ message: 'Author not found' });
        }
        res.status(200).json(updatedAuthor);
    }
    catch (error){
        res.status(400).json({ message: 'Error updating author', error })
    }
})

// delete author
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedAuthor = await Author.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );

        if (!deletedAuthor) {
            return res.status(404).send({ message: 'Author not found' });
        }

        res.status(200).json({
            message: 'Author marked as disabled (isEnable: false)',
            deletedAuthor
        });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting author', error });
    }
});

module.exports = router