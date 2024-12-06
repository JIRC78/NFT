const fs = require("fs");
const Wallet = require("ethereumjs-wallet").default;

const keystoreFile = "C:/Users/DELL/AppData/Local/Ethereum/sepolia/keystore/UTC--2024-12-06T00-02-05.046110400Z--761e05d293f65a15bd64cf4f416dd594013ed866";
const password = ""; 

const keystore = JSON.parse(fs.readFileSync(keystoreFile, "utf8"));

Wallet.fromV3(keystore, password)
    .then((wallet) => {
        console.log("Clave privada:", wallet.getPrivateKeyString());
    })
    .catch((error) => {
        console.error("Error al descifrar la clave privada:", error);
    });
