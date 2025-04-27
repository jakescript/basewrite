const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Disk", function () {
  async function deployAndSet() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Disk = await ethers.getContractFactory("Disk");
    const disk = await Disk.deploy(100);

    return { disk, owner, otherAccount };
  }

  // --- Deployment & Ownership ---
  describe('Deployment & Ownership', () => {
    it('sets the owner on deploy', async () => {
      const { disk, owner } = await loadFixture(deployAndSet);
      expect(await disk.owner()).to.equal(owner.address);
    });
  });

  // --- Admin Functions ---
  describe('Admin Functions', () => {
    it('allows owner to update default character limits', async () => {
      const { disk } = await loadFixture(deployAndSet);

      expect(Number(await disk.defaultCharLimit())).to.eql(100);
      await disk.updateDefaultLimit(200);
      expect(Number(await disk.defaultCharLimit())).to.eql(200);
    });

    it('prevents non-owners from updating default character limits', async () => {
      const { disk, otherAccount } = await loadFixture(deployAndSet);

      expect(Number(await disk.defaultCharLimit())).to.eql(100);

      await expect(disk.connect(otherAccount).updateDefaultLimit(200))
        .to.be.revertedWithCustomError(disk, 'OwnableUnauthorizedAccount')
        .withArgs(otherAccount.address);
    });
  });

  // --- Minting ---
  describe('Minting', () => {
    it('allows users to mint tokens', async () => {
      const { disk, owner } = await loadFixture(deployAndSet);
      const tx = await disk.mint();
      await tx.wait();

      expect(await disk.ownerOf(1)).to.eql(owner.address);
    });

    it('sets character limit on newly minted token', async () => {
      const { disk } = await loadFixture(deployAndSet);

      const tx = await disk.mint();
      await tx.wait();

      expect(Number(await disk.charLimits(1))).to.eql(100);
    });
  });

  // --- Token Utility Functions ---
  describe('Token Utility Functions', () => {
    it('lists all token IDs owned by an address', async () => {
      const { disk, owner } = await loadFixture(deployAndSet);

      await (await disk.mint()).wait();
      await (await disk.mint()).wait();

      const balance = await disk.balanceOf(owner.address);

      let tokenIds = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await disk.tokenOfOwnerByIndex(owner.address, i);
        tokenIds.push(Number(tokenId));
      }

      expect(tokenIds).to.eql([1, 2]);
    });
  });
});
