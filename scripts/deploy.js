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