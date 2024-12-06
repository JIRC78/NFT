const { ethers } = require("ethers");
const contract = require("../artifacts/contracts/BookRegistry.sol/BookRegistry.json");

// Cargar variables de entorno
const { API_URL, PRIVATE_KEY, BOOK_CONTRACT_ADDRESS } = process.env;

// Configuración del proveedor y la billetera
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const bookRegistryContract = new ethers.Contract(
    BOOK_CONTRACT_ADDRESS,
    contract.abi,
    wallet
);

/**
 * Registrar un libro en el contrato inteligente.
 */
async function registerBook(req, res) {
    const { title, author, description } = req.body;

    // Verificar los datos de entrada
    if (!title || !author || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    console.log("Incoming data:", { title, author, description });

    try {
        // Enviar la transacción al contrato inteligente
        const tx = await bookRegistryContract.registerBook(title, author, description);
        await tx.wait();

        console.log("Transaction successful:", tx.hash);
        res.status(200).json({
            message: "Book registered successfully",
            transactionHash: tx.hash,
        });
    } catch (error) {
        console.error("Error registering book:", error);
        res.status(500).json({ error: "Error registering book" });
    }
}

/**
 * Obtener todos los libros registrados en el contrato.
 */
async function getBooks(req, res) {
    try {
        const bookCount = await bookRegistryContract.bookCount();
        const books = [];

        // Iterar sobre los libros registrados
        for (let i = 0; i < bookCount; i++) {
            const book = await bookRegistryContract.getBook(i);
            books.push({
                title: book.title,
                author: book.author,
                description: book.description,
                owner: book.owner,
            });
        }

        console.log("Books fetched successfully:", books);
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Error fetching books" });
    }
}

module.exports = { registerBook, getBooks };
