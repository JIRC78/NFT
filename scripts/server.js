const express = require('express');
const app = express();
const port = 3000;

const { getAllTokenIds, getTokenIdsByAccount, mintNFT } = require('./nfts.js');

app.get('/tokens', async (req, res) => {
    try {
        const tokenIds = await getAllTokenIds();
        res.status(200).json({ success: true, tokenIds });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/tokens/:account', async (req, res) => {
    const account = req.params.account;
    try {
        const tokenIds = await getTokenIdsByAccount(account);
        res.status(200).json({ success: true, tokenIds });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
