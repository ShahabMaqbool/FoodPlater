const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../models/categoryModel");

// CREATE CATEGORY
const addCategory = async (req, res) => {

    try {

        const {
            category_name,
            description,
            item_count,
            status
        } = req.body;

        // Validation
        if (!category_name || !status) {
            return res.status(400).json({
                message: "category_name and status are required"
            });
        }

        const category = await createCategory(
            category_name,
            description,
            item_count || 0,
            status
        );

        res.status(201).json({
            message: "Category created successfully",
            category: category
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create category"
        });
    }
};

// Get all Categories

const categories=async (req,res)=>{

    try{

        const categoryList=await getAllCategories();

        res.status(200).json({
            categories: categoryList
        });

    }
    catch (error){

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch categories"
        });

    }

};

// get caetegory by id

const categoryById = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            category: category
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch category"
        });
    }
};

const editCategory=async (req,res)=>{

    try{

        const {id}=req.params;

        const {
            category_name,
            description,
            item_count,
            status
        }=req.body;

        // validation

        if (!category_name || !status){
            return res.status.json({
                message: "Categroy_name and status are required"

            });

        }



        const category=await updateCategory(
            id,
            category_name,
            description,
            item_count || 0,
            status
        );

        if (!category){
            return res.status.json({
                message: "Category Not found"
            });
        }

        res.status(200).json({
            message: "Category updated sucessfully",
            category: category
        });

        

    }
    catch (error){

        console.error(error);

        res.status(500).json({
            message: "Failed to update category"
        });

    }
};

// DELETE CATEGORY
const removeCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const category = await deleteCategory(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            category: category
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete category"
        });
    }
};

module.exports = {
    addCategory,
    categories,
    categoryById,
    editCategory,
    removeCategory

};