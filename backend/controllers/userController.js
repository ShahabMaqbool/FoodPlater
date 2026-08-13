
const getProfile=async (req,res)=>{
    res.json({
        message: "Protected Route Accessed Successfully",
        user: req.user
    });
};

module.exports={getProfile};