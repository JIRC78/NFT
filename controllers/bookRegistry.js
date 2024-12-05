const { ethers } = require("ethers");
const contract = require("../artifacts/contracts/BookRegistry.sol/BookRegistry.json");

const { API_URL, PRIVATE_KEY, BOOK_CONTRACT_ADDRESS  } = process.env; // Usar CONTRACT_ADDRESS

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const bookRegistryContract = new ethers.Contract(BOOK_CONTRACT_ADDRESS, contract.abi, wallet); // Cambia BOOK_CONTRACT_ADDRESS por CONTRACT_ADDRESS

async function registerBook(req, res) {
    const { title, author, description } = req.body;

    console.log("Incoming data:", { title, author, description }); // Agrega esto para verificar los datos recibidos

    try {
        const tx = await bookRegistryContract.registerBook(title, author, description);
        await tx.wait();

        console.log("Transaction successful:", tx.hash); // Verifica si se completó la transacción
        res.status(200).json({ message: "Book registered successfully", transactionHash: tx.hash });
    } catch (error) {
        console.error("Error registering book:", error); // Muestra el error en la consola
        res.status(500).json({ error: "Error registering book" });
    }
}


async function getBooks(req, res) {
    try {
        const bookCount = await bookRegistryContract.bookCount();
        const books = [];
        for (let i = 0; i < bookCount; i++) {
            const book = await bookRegistryContract.getBook(i);
            books.push({
                title: book.title,
                author: book.author,
                description: book.description,
                owner: book.owner,
            });
        }
        res.status(200).json(books); // Asegúrate de devolver un array
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Error fetching books" });
    }
}


module.exports = { registerBook, getBooks };
