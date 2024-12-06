require('dotenv').config({ path: require('find-config')('.env') })
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')
const {ethers} = require('ethers')

const contract = require('../artifacts/contracts/NFTContract.sol/NFTClase.json'); // Mantén esto como 'contract'
const bookRegistryContract = require('../artifacts/contracts/BookRegistry.sol/BookRegistry.json'); // Agrega el nuevo contrato


const {
    PRIVATE_KEY,
    API_URL,
    PUBLIC_KEY,
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    CONTRACT_ADDRESS
}=process.env

async function createImgInfo(imageRoute) {
    const authResponse = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY
        }
    })
    console.log(authResponse.data)
    
    const stream = fs.createReadStream(imageRoute)
    const data = new FormData()
    data.append("file", stream)
    
    const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        headers: {
            "Content-type": `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY
        }
    })
    const { IpfsHash } = fileResponse.data;
    const fileIPFS = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`
    console.log(fileIPFS)
    return fileIPFS
}

async function createJsonInfo(metaData) {
    const pinataJSONbody = {
        pinataContent: metaData
    }
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
    )
    const { IpfsHash } = jsonResponse.data;
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`
    return tokenURI
}

async function mintNFT(tokenURI) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const etherInterface = new ethers.utils.Interface(contract.abi)
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest')
    const gasPrice = await provider.getGasPrice();
    const { chainId } = await provider.getNetwork();

    const transaction = {
        from: PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData("mintNFT", [PUBLIC_KEY, tokenURI])
    }

    const estimateGas = await provider.estimateGas(transaction)
    transaction.gasLimit = estimateGas;

    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();

    const hash = transactionReceipt.hash;
    console.log("Transaction HASH: ", hash)

    const receipt = await provider.getTransactionReceipt(hash);
    const { logs } = receipt;
    const tokenInBigNumber = ethers.BigNumber.from(logs[0].topics[3])
    const tokenId = tokenInBigNumber.toNumber();
    console.log("NFT TOKEN ID: ", tokenId)

    return hash
}

async function createNFT() {
    try {
        const imgInfo = await createImgInfo('../images/nftexamen.jpg');
        const metadata = {
            image: imgInfo,
            name: 'pinwi2', // Cambia esto por el nombre del NFT
            description: 'otravezyo',
            attributes: [
                { 'trait_type': 'color', 'value': 'brown' },
                { "trait_type": 'background', 'value': 'white' }
            ]
        }

        const tokenUri = await createJsonInfo(metadata)
        const nftResult = await mintNFT(tokenUri)
        console.log(nftResult);
        return nftResult
    } catch (error) {
        console.error("Error creating NFT: ", error)
    }
}

async function getAllTokenIds() {
    try {
        const provider = new ethers.providers.JsonRpcProvider(API_URL);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);

        const transferEvents = await contractInstance.queryFilter("Transfer", 0, "latest");

        // Filtrar solo los tokens asociados a la cuenta pública
        const tokenIds = transferEvents
            .filter(event => event.args.to.toLowerCase() === PUBLIC_KEY.toLowerCase())
            .map(event => ethers.BigNumber.from(event.args.tokenId).toNumber());

        console.log("Token IDs asociados a la cuenta:", tokenIds);
        return tokenIds;
    } catch (error) {
        console.error("Error obteniendo Token IDs:", error);
    }
}

async function getTokenIdsByAccount(account) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(API_URL);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);

        const transferEvents = await contractInstance.queryFilter("Transfer", 0, "latest");

        const tokenIds = transferEvents
            .filter(event => event.args.to.toLowerCase() === account.toLowerCase())
            .map(event => ethers.BigNumber.from(event.args.tokenId).toNumber());

        console.log(`Token IDs asociados a la cuenta ${account}:`, tokenIds);
        return tokenIds;
    } catch (error) {
        console.error("Error obteniendo Token IDs:", error);
    }
}
async function mintNFT(tokenURI) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const etherInterface = new ethers.utils.Interface(contract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest');
    const gasPrice = await provider.getGasPrice();
    const { chainId } = await provider.getNetwork();

    const transaction = {
        from: PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData("mintNFT", [PUBLIC_KEY, tokenURI])
    };

    const estimateGas = await provider.estimateGas(transaction);
    transaction.gasLimit = estimateGas;

    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();

    const hash = transactionReceipt.hash;
    console.log("Transaction HASH: ", hash);

    // Construir la URL para ver la transacción en Etherscan
    const etherscanURL = `https://etherscan.io/tx/${hash}`;
    console.log("Ver transacción en Etherscan: ", etherscanURL);

    return etherscanURL; // Regresa la URL de la transacción
}

async function registerBook(title, author, description) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, bookRegistryContract.abi, wallet);

    try {
        const tx = await contractInstance.registerBook(title, author, description);
        await tx.wait();
        console.log(`Book registered successfully: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        console.error("Error registering book:", error);
        throw error;
    }
}

async function registerAndTokenizeBook(title, author, description) {
    try {
        // Generar metadatos del NFT
        const metadata = {
            name: title,
            description: description,
            attributes: [{ trait_type: "Author", value: author }],
        };

        // Subir metadatos a IPFS
        const tokenURI = await createJsonInfo(metadata);

        // Crear el NFT
        const nftTransactionHash = await mintNFT(tokenURI);
        console.log(`NFT creado con éxito. TxHash: ${nftTransactionHash}`);

        return { nftTransactionHash };
    } catch (error) {
        console.error("Error creando NFT:", error);
        throw error;
    }
}





module.exports = { mintNFT, createImgInfo, createJsonInfo, getAllTokenIds, getTokenIdsByAccount,registerBook, registerAndTokenizeBook, };

//getTokenIdsByAccount('0x05aBA7873F2C749Ad63f2d7E2F13f6a95761d745');


//getAllTokenIds();


//createNFT()
