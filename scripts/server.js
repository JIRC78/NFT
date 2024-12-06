const express = require('express');
const multer = require('multer'); // Importa multer
const cors = require('cors');
const path = require('path');

const { getAllTokenIds, getTokenIdsByAccount, mintNFT, registerAndTokenizeBook } = require('./nfts.js');
const { createUser, getUsers } = require('../controllers/user.js'); // Asegúrate de que esta ruta es correcta

const app = express();
const port = 3000;

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único para cada archivo
    },
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Asegúrate de que la carpeta de uploads exista
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Importa rutas
const bookRoutes = require("../routers/bookRoutes.js");
app.use("/books", bookRoutes);

// Ruta para registrar y tokenizar un libro
app.post("/books/register-tokenize", upload.single("image"), async (req, res) => {
    const { title, author, description } = req.body;
    const imagePath = req.file ? req.file.path : null; // Verifica si se subió una imagen

    try {
        const result = await registerAndTokenizeBook(title, author, description, imagePath);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error registering and tokenizing book:", error);
        res.status(500).json({ error: "Failed to register and tokenize book" });
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
        if (user.firstName) {
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
        const users = await getUsers(); // Llama a getUsers para obtener todos los usuarios

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
