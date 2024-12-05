// const { ethers } = require("hardhat");

// async function main() {
//     const NFT = await ethers.getContractFactory("NFTClase"); // Asegúrate de que "NFTClase" sea el nombre correcto del contrato
//     const nfts = await NFT.deploy();
//     await nfts.deployed();

//     const txHash = nfts.deployTransaction.hash; // Corrección aquí
//     const txReceipt = await ethers.provider.waitForTransaction(txHash);
//     console.log("Contract deployed to address:", txReceipt.contractAddress);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
// const { ethers } = require("hardhat");

// async function main() {
//     const NFT = await ethers.getContractFactory("Sales"); // Asegúrate de que "NFTClase" sea el nombre correcto del contrato
//     const nfts = await NFT.deploy();
//     await nfts.deployed();

//     const txHash = nfts.deployTransaction.hash; // Corrección aquí
//     const txReceipt = await ethers.provider.waitForTransaction(txHash);
//     console.log("Contract deployed to address:", txReceipt.contractAddress);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
const { ethers } = require("hardhat");

// async function main() {
//     const NFT = await ethers.getContractFactory("Users"); // Asegúrate de que "NFTClase" sea el nombre correcto del contrato
//     const nfts = await NFT.deploy();
//     await nfts.deployed();

//     const txHash = nfts.deployTransaction.hash; // Corrección aquí
//     const txReceipt = await ethers.provider.waitForTransaction(txHash);
//     console.log("Contract deployed to address:", txReceipt.contractAddress);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });


    async function multiDeploy(){
        const owner = ["0x05aBA7873F2C749Ad63f2d7E2F13f6a95761d745", "0x68efA4cf43896096eBd76149ad71D837f02692b9"] // aqui van las cuentas
        const requiredApprovals = 2;
        const WalletMultiSig = await ethers.getContractFactory("WalletMultisig");
        const wallet = await WalletMultiSig.deploy(owner,requiredApprovals);
        console.log("WalletMultiSig deployed to:", wallet.address);
    }

    
multiDeploy().then(()=>process.exit(0)).catch((error)=>{
    console.error(error);
    process.exit(1);
})
