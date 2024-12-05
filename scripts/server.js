const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

const { getAllTokenIds, getTokenIdsByAccount, mintNFT } = require('./nfts.js');
const { createUser, getUsers } = require('../controllers/user.js'); // Asegúrate de que esta ruta es correcta
app.use(cors());
// Middleware para manejar JSON
app.use(express.json());

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
app.get('/api/check-user/:address', async (req, res) => {
    const address = req.params.address;
    try {
        // Llama a la función `getUsers` para obtener todos los usuarios registrados
        const users = await getUsers(); // `getUsers` está en tu controlador user.js

        // Busca si la dirección está en la lista de usuarios
        const user = users.find((user) => user.walletAddress === address);

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

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
