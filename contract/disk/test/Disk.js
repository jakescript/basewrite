const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Disk", function () {
  async function deployAndSet() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Disk = await ethers.getContractFactory("Disk");
    const disk = await Disk.deploy();

    return { owner, otherAccount, disk };
  }

  // describe("Deployment", function () {
  //   it("Should set the right owner", async function () {
  //     const { disk, owner } = await loadFixture(deployAndSet);
  //     expect(await disk.owner()).to.equal(owner.address);
  //   });
  // });
});
