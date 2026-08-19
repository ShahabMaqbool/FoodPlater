
const express=require("express");

const verifyToken=require("../middleware/authMiddleware");
const { requireSuperAdmin, requireStafforAdmin }=require("../middleware/roleMiddleware");

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
    requireStafforAdmin,
    addCategory
    
);

// get all categories

router.get(
    "/",
    verifyToken,
    requireStafforAdmin,
    categories
);

router.get(
    "/:id",
    verifyToken,
    requireStafforAdmin,
    categoryById
);

// UPDATE CATEGORY
router.put(
    "/:id",
    verifyToken,
    requireStafforAdmin,
    editCategory
);

router.delete(
    "/:id",
    verifyToken,
    requireSuperAdmin,
    removeCategory
);



module.exports=router;