const express = require("express");
const router = express.Router();
const { registerAndTokenizeBook } = require("../scripts/nfts"); // Lógica para tokenizar y registrar
const { generateAIImage } = require("../scripts/aiService.js"); // Servicio de generación de imágenes

// Ruta para registrar y tokenizar libros
router.post("/register-tokenize", async (req, res) => {
    const { title, author, description } = req.body;

    try {
        console.log("Paso 1: Generando imagen con IA...");
        const imageUrl = await generateAIImage(`${title} ${description}`);
        console.log("Imagen generada:", imageUrl);

        console.log("Paso 2: Registrando y tokenizando libro...");
        const result = await registerAndTokenizeBook(title, author, description, imageUrl);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error registrando y tokenizando libro:", error);
        res.status(500).json({ error: "Failed to register and tokenize book" });
    }
});

module.exports = router;
