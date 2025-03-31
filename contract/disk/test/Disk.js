const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat')

describe("Disk", function () {
  async function deployAndSet() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Disk = await ethers.getContractFactory("Disk");
    const disk = await Disk.deploy(100);

    return { disk, owner, otherAccount };
  }

  describe('Admin functions', () => {
    it('can update default character limits on minting', async () => {
      const { disk, owner } = await loadFixture(deployAndSet)

      expect(Number(await disk.defaultCharLimit())).to.eql(100)

      await disk.updateDefaultLimit(200)

      expect(Number(await disk.defaultCharLimit())).to.eql(200)
    })

    it('non admins cannot update default character limits', async () => {
      const { disk, owner, otherAccount } = await loadFixture(deployAndSet)

      expect(Number(await disk.defaultCharLimit())).to.eql(100)

      await expect(disk.connect(otherAccount).updateDefaultLimit(200))
        .to.be.revertedWithCustomError(
          disk,
          `OwnableUnauthorizedAccount`
        ).withArgs(otherAccount.address)
    })
  })

  it('sets owner on deploy', async () => {
    const { disk, owner } = await loadFixture(deployAndSet)
    expect(await disk.owner()).to.equal(owner.address)
  })

  it('allows minting', async () => {
    const { disk, owner } = await loadFixture(deployAndSet)
    const tx = await disk.mint()
    await tx.wait()

    expect(await disk.ownerOf(1)).to.eql(owner.address)
  })

  it('can list all owner token ids', async () => {
    const { disk, owner } = await loadFixture(deployAndSet)

    const tx = await disk.mint()
    await tx.wait()

    const tx2 = await disk.mint()
    await tx2.wait()

    const balance = await disk.balanceOf(owner.address)

    let tokenIds = []

    for (let i = 0; i < balance; i++) {
      const tokenId = await disk.tokenOfOwnerByIndex(owner.address, i)
      tokenIds.push(Number(tokenId))
    }

    expect(tokenIds).to.eql([1,2])
  })

  it('sets initial character limits', async () => {
    const { disk, owner } = await loadFixture(deployAndSet)

    const tx = await disk.mint()
    await tx.wait()

    expect(Number(await disk.charLimits(1)))
      .to.eql(100)
  })

  it('token owners can use characters', async () => {
    const { disk, owner } = await loadFixture(deployAndSet)

    let tx = await disk.mint()
    await tx.wait()

    expect(Number(await disk.charLimits(1)))
      .to.eql(100)

    tx = await disk.updateUsage(1, 10)
    await tx.wait()

    expect(Number(await disk.usedChars(1)))
      .to.eql(10)
  })

});
