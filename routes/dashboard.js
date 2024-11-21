const express = require("express")
const router = express.Router()
const { Category, Book, Author } = require("../db")
const authenticateToken = require("../authenticateToken")

router.use(authenticateToken);

// Hiển thị thống kê số lượng, biểu đồ (chart)
router.get("/", async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear; 
        
        const numAuthor = await Author.countDocuments({isEnable: true})
        const numBook = await Book.countDocuments({isEnable: true})
        const numCategory = await Category.countDocuments({isEnable: true})

        // Thống kê số lượng sách theo từng Category theo năm
        const dataCategoryYear = await Book.aggregate([
            {
                $match: {
                    yearPublication: year
                }
            },
            {
                $group: {
                    _id: "$id_category",
                    totalBooks: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: 'id',
                    as: 'categoryDetails'
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    categoryName: "$categoryDetails.name",
                    totalBooks: 1
                }
            }
        ]);

        // Thống kê số lượng sách được tạo theo từng quý trong năm
        const dataBookQuarterly = await Book.aggregate([
            {
                $match: {
                    yearPublication: year
                }
            },
            {
                $project: {
                    quarter: {
                        $switch: {
                            branches: [
                                { case: { $lte: [{ $month: "$createdAt" }, 3] }, then: "Q1" },
                                { case: { $lte: [{ $month: "$createdAt" }, 6] }, then: "Q2" },
                                { case: { $lte: [{ $month: "$createdAt" }, 9] }, then: "Q3" }
                            ],
                            default: "Q4"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$quarter",
                    totalBooks: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            numAuthor: numAuthor, 
            numBook: numBook,
            numCategory: numCategory,
            dataCategoryYear: dataCategoryYear,
            dataBookQuarterly: dataBookQuarterly
        }); 

       
    } catch (error) {
        console.error("Error occurred:", error.stack);
        res.status(400).json({ message: 'Error fetching books', error });
    }
});

module.exports = router