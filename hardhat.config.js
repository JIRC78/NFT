require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
const PRIVATE_KEY='1d65c02ba56f02c578e665c51db2640d20551768ddea836df52c58b2ad5f73b6'
const API_URL='https://eth-sepolia.g.alchemy.com/v2/twi8dA6tApldJjmR9KS65kXWgEq6hd5o'

module.exports = {
  solidity: "0.8.24",
  defaultNetwork:'sepolia',
  networks:{
    sepolia:{
      url:API_URL,
      accounts:[`0x${PRIVATE_KEY}`]
      
    }
  }
};
