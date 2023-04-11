const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", function(){
    let Lottery;
    let lotteryContract;
    let owner;
    let plyr1;
    let plyr2;
    let plyr3;
    let plyr4;
    let plyrs;

    beforeEach(async function(){
        Lottery = await ethers.getContractFactory("Lottery");
        [owner, plyr1, plyr2, plyr3, plyr4, ...plyrs] = await ethers.getSigners();
        lotteryContract = await Lottery.deploy();
    })
    describe("Deployment", function(){
        it("Should set the Manager", async function(){
            expect(await lotteryContract.manager()).to.equal(owner.address);
        })

        it("should not allow players to enter with incorrect amount", async function(){
            await expect(lotteryContract.connect(plyr2).enterInLottery({ value: ethers.utils.parseEther("0.2") })).to.be.revertedWith("Please send exactly 0.1 ether");

         // Get the array of players from the contract (should be empty)
         const players = await lotteryContract.getPlayers();

         // Expect the players array to be empty
          expect(players).to.have.lengthOf(0);
        })

        it("should add a player to the lottery after sending amount", async function () {
            // Enter player1 into the lottery by sending 0.1 Ether
            await lotteryContract.connect(plyr1).enterInLottery({ value: ethers.utils.parseEther("0.1") });
        
            // Get the array of players from the contract
            const players = await lotteryContract.getPlayers();
        
            // Expect the players array to contain player1's address
            expect(players).to.have.lengthOf(1);
            expect(players[0]).to.equal(plyr1.address);
        });

        it("should return the list of players in the correct order.", async function () {
            // Enter players into the lottery by sending 0.1 Ether
            await lotteryContract.connect(plyr1).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr2).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr3).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr4).enterInLottery({ value: ethers.utils.parseEther("0.1") });
        
            // Get the array of players from the contract
            const players = await lotteryContract.getPlayers();
        
            // Expect the players array to contain player1's address
            expect(players).to.have.lengthOf(4);
            expect(players[0]).to.equal(plyr1.address);
            expect(players[1]).to.equal(plyr2.address);
            expect(players[2]).to.equal(plyr3.address);
            expect(players[3]).to.equal(plyr4.address);
        });

        it("should allow only manager to get the balance of this contract", async function(){
            await expect(lotteryContract.connect(plyr1).getBalance()).to.be.revertedWith("You are not the manager");
        })

        it("should ensure that the getBalance function returns the correct balance of the contract", async function(){
            await lotteryContract.connect(plyr1).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr2).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr3).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr4).enterInLottery({ value: ethers.utils.parseEther("0.1") });

            const balanceAfter = ethers.utils.parseEther("0.4");
             
            expect(await lotteryContract.getBalance()).to.equal(balanceAfter);
        })


        it("Only manager can pick the winner", async function(){
            await expect(lotteryContract.connect(plyr1).pickWinner()).to.be.revertedWith("Only Manager can pick the Winner");
        })

        it("Participants should be greater than or equal to 3", async function(){
            await lotteryContract.connect(plyr1).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr2).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await expect(lotteryContract.pickWinner()).to.be.revertedWith("Cannot pick a winner with less than 3 participants");
           
        })

        it("should transfer the winnig amount to the winner", async function(){
            await lotteryContract.connect(plyr1).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr2).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr3).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr4).enterInLottery({ value: ethers.utils.parseEther("0.1") });

            await lotteryContract.connect(owner).pickWinner();

            const plyr1initialBalance = await lotteryContract.getBalanceAddr(plyr1.address);
            //console.log("initial balance", plyr1initialBalance.toString());
            expect(plyr1initialBalance).to.be.above(ethers.utils.parseEther("0.3"));

            const contractBalance = await lotteryContract.getBalance();
            expect(contractBalance).to.equal(ethers.utils.parseEther("0")); // contract balance should be 0 after winner is picked
        })

        it(" Ensure that the players array is emptied after a winner is picked", async function () {
            // Enter players into the lottery by sending 0.1 Ether
            await lotteryContract.connect(plyr1).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr2).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr3).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            await lotteryContract.connect(plyr4).enterInLottery({ value: ethers.utils.parseEther("0.1") });
            
            //picking up the winner
            await lotteryContract.connect(owner).pickWinner();

            // Get the array of players from the contract
            const players = await lotteryContract.getPlayers();
            
        
            // Expect the players array to contain no address
            expect(players).to.have.lengthOf(0);
            
        });
    });
})
