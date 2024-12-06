const express = require("express");
const router = express.Router();
const { registerBook, getBooks } = require("../controllers/bookRegistry");
const { registerAndTokenizeBook } = require("../scripts/nfts"); // Importa la lógica de tokenización

// Ruta para registrar libros
router.post("/register", registerBook);

// Ruta para obtener todos los libros
router.get("/all", getBooks);

// Nueva ruta para registrar y tokenizar un libro con NFT
router.post("/register-tokenize", async (req, res) => {
    const { title, author, description } = req.body;

    try {
        const result = await registerAndTokenizeBook(title, author, description);
        res.status(200).json(result); // Devuelve el resultado del registro y tokenización
    } catch (error) {
        console.error("Error registrando y tokenizando libro:", error);
        res.status(500).json({ error: "Failed to register and tokenize book" });
    }
});

module.exports = router;
