require('dotenv').config({ path: require('find-config')('.env') })
const express = require('express');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { ethers } = require('ethers');

const contract = require('../artifacts/contracts/NFTContract.sol/NFTClase.json');

const {
    PRIVATE_KEY,
    API_URL,
    PUBLIC_KEY,
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    CONTRACT_ADDRESS
} = process.env;

const app = express();
app.use(express.json());

async function uploadImageToPinata(imageUrl) {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    const data = new FormData();
    data.append("file", response.data);

    const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        headers: {
            ...data.getHeaders(),
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY
        }
    });

    const { IpfsHash } = fileResponse.data;
    return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}

async function uploadMetadataToPinata(metadata) {
    const pinataJSONbody = { pinataContent: metadata };
    const jsonResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        pinataJSONbody,
        {
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        }
    );

    const { IpfsHash } = jsonResponse.data;
    return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}

async function mintNFT(tokenURI) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, wallet);

    const tx = await contractInstance.mintNFT(PUBLIC_KEY, tokenURI);
    const receipt = await tx.wait();

    const event = receipt.events.find(event => event.event === 'Transfer');
    const tokenId = event.args[2].toString();

    return { transactionHash: receipt.transactionHash, tokenId };
}

app.post('/crear-nft', async (req, res) => {
    const { name, description, imageUrl } = req.body;

    if (!name || !description || !imageUrl) {
        return res.status(400).json({ error: "name, description, and imageUrl are required" });
    }

    try {
        const imageIPFS = await uploadImageToPinata(imageUrl);
        const metadata = {
            name,
            description,
            image: imageIPFS,
            attributes: [
                { 'trait_type': 'color', 'value': 'brown' },
                { "trait_type": 'background', 'value': 'white' }
            ]
        };
        const tokenUri = await uploadMetadataToPinata(metadata);
        const { transactionHash, tokenId } = await mintNFT(tokenUri);

        res.status(200).json({
            message: "NFT creado exitosamente",
            transactionHash: transactionHash,
            tokenId: tokenId
        });
    } catch (error) {
        console.error("Error creating NFT: ", error);
        res.status(500).json({ error: "Error creating NFT", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
