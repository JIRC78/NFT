require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
const PRIVATE_KEY='d5442de4954c2cd5030928d6362186b167f026eb0e6df232865796988b1c9ac0'
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
