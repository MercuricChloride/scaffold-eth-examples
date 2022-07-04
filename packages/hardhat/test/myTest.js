const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("SimpleSBT", function () {
    it("Should deploy SimpleSBT", async function () {
      const [addr0] = await ethers.getSigners();
      const YourContract = await ethers.getContractFactory("SimpleSBT");

      myContract = await YourContract.deploy("SimpleSBT", "SSBT", [
        addr0.address,
      ]);
    });

    describe("mint()", function () {
      it("Should allow a owner of an sbt to mint a new token", async function () {
        const [addr0, addr1] = await ethers.getSigners();
        expect(await myContract.balanceOf(addr0.address)).to.equal(1);
        expect(await myContract.totalSupply()).to.equal(1);
        expect(await myContract.mint(addr1.address));
        expect(await myContract.balanceOf(addr1.address)).to.equal(1);
        expect(await myContract.totalSupply()).to.equal(2);
      });

      it("Shouldn't allow an owner of an SBT to transfer their token", async function () {
        const [addr0, addr1] = await ethers.getSigners();
        expect(await myContract.balanceOf(addr0.address)).to.equal(1);
        await expect(myContract.transferFrom(addr0.address, addr1.address, 1))
          .to.be.reverted;
      });

      it("Should only allow the minter to change metadata", async function() {
        const [addr0, addr1] = await ethers.getSigners();
        await expect(myContract.connect(addr1).setTokenMetadata(2, "test")).to.be.reverted;

        expect(await myContract.connect(addr0).setTokenMetadata(2, "test"));
        expect(await myContract.getMetadata(2)).to.equal("test");
      });

      it("Should allow an owner of an sbt to burn their token", async function () {
        const [addr0] = await ethers.getSigners();
        expect(await myContract.balanceOf(addr0.address)).to.equal(1);
        expect(await myContract.burn(1));
        expect(await myContract.balanceOf(addr0.address)).to.equal(0);
      });
    });
  });
});
