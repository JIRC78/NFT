const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
 //crea un usuario ok
router.post("/user",async (req,res)=>{
    try {
        let user = await userController.createUser(req.body.firstName,req.body.lastName);
        res.json(user);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
//consulta todos los usuarios ok
router.get("/users",async (req,res)=>{
    try {
        let user = await userController.getUsers();
        res.json(user);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
//trae un usuario en especifico ok
 
router.get("/users/:id",async (req,res)=>{
    try {
        let user = await userController.getUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
 
//actualiza la cantidad de amount  de un usuario ok
router.put('/user',async (req,res)=>{
try {
    let user = await userController.updateAmount(req.body.id,req.body.amount)
    res.json(user);
} catch (error) {
    res.status(500).json({message:error.message});
}
}
)

module.exports = router;
 