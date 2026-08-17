
const express=require("express");

const verifyToken=require("../middleware/authMiddleware");
const requireAdmin=require("../middleware/roleMiddleware");

const {
    addCategory,
    categories,
    categoryById,
    editCategory,
    removeCategory

}=require("../controllers/categoryController");

const router=express.Router();

// create category
router.post(
    "/",
    verifyToken,
    requireAdmin,
    addCategory
    
);

// get all categories

router.get(
    "/",
    verifyToken,
    requireAdmin,
    categories
);

router.get(
    "/:id",
    verifyToken,
    requireAdmin,
    categoryById
);

// UPDATE CATEGORY
router.put(
    "/:id",
    verifyToken,
    requireAdmin,
    editCategory
);

router.delete(
    "/:id",
    verifyToken,
    requireAdmin,
    removeCategory
);



module.exports=router;