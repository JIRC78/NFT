const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// Importaciones
const { getAllTokenIds, getTokenIdsByAccount, mintNFT, registerAndTokenizeBook } = require('./nfts.js');
const { createUser, getUsers } = require('../controllers/user.js'); // Verifica que esta ruta sea correcta

const bookRoutes = require("../routers/bookRoutes.js"); // Asegúrate de que esta ruta sea correcta

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON
app.use("/books", bookRoutes);

// Ruta para registrar y tokenizar un libro
app.post("/books/register-tokenize", async (req, res) => {
    const { title, author, description } = req.body;

    try {
        // Llamar a la lógica de tokenización en `nfts.js`
        const result = await registerAndTokenizeBook(title, author, description);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error registrando y tokenizando libro:", error);
        res.status(500).json({ error: "Error al registrar y tokenizar el libro." });
    }
});

// Ruta para obtener todos los tokens
app.get('/tokens', async (req, res) => {
    try {
        const tokenIds = await getAllTokenIds();
        res.status(200).json({ success: true, tokenIds });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para obtener tokens por cuenta
app.get('/tokens/:account', async (req, res) => {
    const account = req.params.account;
    try {
        const tokenIds = await getTokenIdsByAccount(account);
        res.status(200).json({ success: true, tokenIds });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para verificar si un usuario está registrado
app.get('/users/:wallet', async (req, res) => {
    const wallet = req.params.wallet;
    try {
        const user = await getUsers(wallet);
        if (user && user.firstName) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ruta para registrar un nuevo usuario
app.post('/users', async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const receipt = await createUser(firstName, lastName);
        res.status(200).json({ success: true, receipt });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para verificar si el usuario está registrado
app.post('/api/check-user', async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const users = await getUsers();

        // Busca al usuario por `firstName` y `lastName`
        const user = users.find(
            (user) =>
                user.firstName.toLowerCase() === firstName.toLowerCase() &&
                user.lastName.toLowerCase() === lastName.toLowerCase()
        );

        if (user) {
            res.status(200).json({ isRegistered: true, user });
        } else {
            res.status(404).json({ isRegistered: false });
        }
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ error: "Failed to check user registration" });
    }
});

// Endpoint para mostrar la transacción en el explorador de blockchain
app.get('/transaction/:hash', (req, res) => {
    const transactionHash = req.params.hash;
    const etherscanURL = `https://etherscan.io/tx/${transactionHash}`;
    res.status(200).json({ success: true, etherscanURL });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
