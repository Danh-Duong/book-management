const express = require("express")
const router = express.Router()
const { Category } = require("../db")
const authenticateToken = require("../authenticateToken")

router.use(authenticateToken);

// get category page filter
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 5; 
        const categoryId = req.query.categoryId;
        const name = req.query.name;
        const isEnable = (req.query.isEnable ?? "true") === "true";

        const filter = {isEnable}
        if (categoryId) filter.id = categoryId;
        if (name) filter.name = new RegExp(name, 'i');    
        
        const skip = (page - 1) * limit;
        const categories = await Category.find(filter) 
            .skip(skip)
            .limit(limit);

        const totalBooks = await Category.countDocuments(filter);
        const totalPages = Math.ceil(totalBooks / limit);

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalBooks: totalBooks,
            categories: categories
        });
    } catch (error) {
        console.error("Error occurred:", error.stack);
        res.status(400).json({ message: 'Error fetching books', error });
    }
});

// show form create category
router.get("/create", (req, res) => res.render(''))

// show form update category
router.get("update/:id", async(req, res) => {
    try{
        const categoryId = req.params.id
        const category = await Category.findOne({ id: categoryId , isEnable: true});
        if (category) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Fail to get category', error });
    }
})

// create new category
router.post("/store", async(req, res) => {
    try{
        const category =  new Category(req.body)
        const result = await category.save()
        res.status(200).json(result);
    }
    catch (error){
        res.status(400).json({ message: 'Error creating category', error })
    }
})

// update category
router.put("/save/:id", async(req, res) => {
    try{
        const updatedCategory = await Category.findOneAndUpdate({id: req.params.id}, req.body, {new : true})

        if (!updatedCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    }
    catch (error){
        res.status(400).json({ message: 'Error updating category', error })
    }
})

// delete category
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedCategory = await Category.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );

        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category marked as disabled (isEnable: false)',
            deletedCategory
        });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting category', error });
    }
});

module.exports = router