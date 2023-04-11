# Hardhat Testing (Lottery Smart Contract)

This is a Solidity smart contract that represents named **Lottery**. The contract allows multiple players to enter by sending a fixed amount of Ether (0.1 ether) to the contract address. Once a minimum of 3 players have entered, the contract manager can call the `pickWinner` function to select a random winner among the players who have entered. The winner receives the entire contract balance, and the players array is reset to start a new lottery system.

## Prerequisites

Before you can run the tests, make sure you have the following installed:

- Node.js
- Hardhat

## Installation

1. For Hardhat Installation
``` 
npm init --yes
npm install --save-dev hardhat
```

2. For running hardhat sample project install these dependencies:
```
npm install --save-dev @nomiclabs/hardhat-ethers@^2.0.5 @nomiclabs/hardhat-waffle@^2.0.3 
npm install --save-dev chai@^4.3.6 ethereum-waffle@^3.4.4 ethers@^5.6.2 hardhat@^2.9.2
```

## Deploying Smart Contract to Localhost

1. Write your smart contract in Solidity and save it in the `contracts/` folder.

2. In the `hardhat.config.js` file, configure your local development network by adding the following:

```
require("@nomiclabs/hardhat-waffle")


module.exports = {
    solidity: "0.8.9",
    networks: {
      hardhat: {
        chainId: 1337,
      },
    },
  };
  ```

  3. In the `scripts/` folder, create a new script to deploy your contract to the local network:
  ```
 const { ethers } = require("hardhat");

async function main(){
    // here we are getting the instance of the contract
    const [deployer] = await ethers.getSigners();  //is used to get an array of signer objects

    const Lottery = await ethers.getContractFactory("Lottery");
    const lotteryContract = await Lottery.deploy();
    console.log("Lottery Smart Contract Address:", lotteryContract.address);
}

main().then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
})
```
4. Compile and deploy the smart contract using Hardhat

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

``` 

This will deploy your smart contract to the local development network.
## Running the Tests

To run the tests, use the following command:

`npx hardhat test
`

This will run all the tests in the `test` folder.

## Tests
The tests are located in the `test` folder and cover the following scenarios:

- Assigning the contract Manager
- should not allow players to enter with incorrect amount
- should add a player to the lottery after sending amount
- should return the list of players in the correct order
- should allow only manager to get the balance of this contract
- should ensure that the getBalance function returns the correct balance of the contract
- Only manager can pick the winner
- Participants should be greater than or equal to 3
- should transfer the winnig amount to the winner
- Ensure that the players array is emptied after a winner is picked

## Conclusion
Writing unit tests for smart contracts is an essential part of the development process. Hardhat makes it easy to write and run tests, and can be used with a variety of testing frameworks.

In this repository, we have demonstrated how to write unit tests for a sample smart contract called **Lottery**.