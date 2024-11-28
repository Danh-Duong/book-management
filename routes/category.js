const express = require("express")
const router = express.Router()
const { Category } = require("../db")
const authenticateToken = require("../authenticateToken")
const { formatDateToDDMMYYYY } = require("../utils/Utils");

router.use(authenticateToken);

// get category page filter
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 999999; 
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
        const categories = await Category.find(filter) 
            .skip(skip)
            .limit(limit);

        const formattedCategories = categories.map(category => {
            const categoryObj = category.toObject();
            categoryObj.createdAt = formatDateToDDMMYYYY(categoryObj.createdAt);
            return categoryObj;
        });
            

        const totalCategorys = await Category.countDocuments(filter);
        const totalPages = Math.ceil(totalCategorys / limit);

        res.render("admin/manage_category",{
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalCategorys,
            categories: formattedCategories,
            valueSearch: valueSearch,
            error: null
        })
    } catch (error) {
        console.error("Error occurred:", error.stack);
        res.status(400).json({ message: 'Error fetching books', error });
    }
});

router.get("/create", (req, res) =>{
    res.render("admin/save_category",{error: null, action: "add", data: {
        id: "",
        name: "",
        desc: "",
    }})
})

// show form update category
router.get("/update/:id", async(req, res) => {
    try{
        const categoryId = req.params.id
        const category = await Category.findOne({ id: categoryId , isEnable: true});
        if (category) {
            res.render("admin/save_category",{error: null,action: '', data: {
                id: category.id,
                name: category.name,
                desc: category.desc,
            }})
        } 
    } catch (error) {
        res.status(400).json({ message: 'Fail to get category', error });
    }
})

// create new category
router.post("/store", async(req, res) => {
    try{    
        const existedCate = await Category.findOne({id: req.body.id})
        if (existedCate){
            return res.render("admin/save_category", {
                error: "ID đã tồn tại. Vui lòng sử dụng ID khác!",
                data: req.body,
                action: 'add',
            })
        }
        const category =  new Category(req.body)
        await category.save()
        return res.redirect("/admin/categories")
    }
    catch (error){
        res.status(400).json({ message: 'Error creating category', error })
    }
})

// update category
router.post("/save/:id", async(req, res) => {
    try{
        const updatedCategory = await Category.findOneAndUpdate({id: req.params.id}, req.body, {new : true})
        if (!updatedCategory) {
            return res.render("admin/manage_category", {error: "Không thể cập nhập thông tin danh mục"})
        }
        return res.redirect("/admin/categories")
    }
    catch (error){
        res.status(400).json({ message: 'Error updating category', error })
    }
})

// delete category
router.get("/delete/:id", async (req, res) => {
    try {
        const deletedCategory = await Category.findOneAndUpdate(
            { id: req.params.id },
            { isEnable: false },   
            { new: true }    
        );

        if (!deletedCategory) {
            return res.render("admin/manage_category", {error: "Không thể xóa thông tin danh mục"})
        }

        return res.redirect("/admin/categories")

    } catch (error) {
        res.status(400).json({ message: 'Error deleting category', error });
    }
});

module.exports = router