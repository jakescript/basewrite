const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require('hardhat')

describe("Disk", function () {
  async function deployAndSet() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Disk = await ethers.getContractFactory("Disk");
    const disk = await Disk.deploy();

    return { disk, owner, otherAccount };
  }

  it.only('deplys', async () => {
    const { disk } = await loadFixture(deployAndSet)
    console.log(disk)
  })

});
