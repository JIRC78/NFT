const express = require("express");
const router = express.Router();
const { registerBook, getBooks } = require("../controllers/bookRegistry");

router.post("/register", registerBook); // Ruta para registrar libros
router.get("/all", getBooks);          // Ruta para obtener todos los libros

module.exports = router;
