const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe('BaseWrite Contract', function () {
  async function deployAndSet() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Disk = await ethers.getContractFactory("Disk");
    const disk = await Disk.deploy(100);

    const BaseWrite = await ethers.getContractFactory("BaseWrite");
    const baseWrite = await BaseWrite.deploy(disk.target);

    return { baseWrite, disk, owner, otherAccount };
  }

  // --- Deployment Tests ---
  describe('Deployment', function () {
    it('sets the owner on deploy', async () => {
      const { baseWrite, owner } = await loadFixture(deployAndSet);
      expect(await baseWrite.owner()).to.equal(owner.address);
    });

    it('starts with first write active', async () => {
      const { baseWrite } = await loadFixture(deployAndSet);
      const currentStoryId = await baseWrite.storyCount();
      const currentStory = await baseWrite.stories(currentStoryId)

      expect(currentStory.isActive).to.equal(true);
      expect(Number(currentStoryId)).to.equal(1);
    });
  });

  // --- Access Control ---
  describe('Access Control', function () {
    it('only owner can start a write', async () => {
      const { baseWrite, otherAccount } = await loadFixture(deployAndSet);

      await expect(baseWrite.connect(otherAccount).startStory())
        .to.be.revertedWithCustomError(baseWrite, 'OwnableUnauthorizedAccount')
        .withArgs(otherAccount.address);
    });

    it('start story emits event', async () => {
      const { baseWrite } = await loadFixture(deployAndSet)
      await expect(baseWrite.startStory())
        .to.emit(baseWrite, 'StoryStarted')
        .withArgs(2);
    })
  });

  // --- Contribution Functionality ---
  describe('Contributions', function () {
    it('allows contributing to a write', async () => {
      const { baseWrite, disk, owner } = await loadFixture(deployAndSet);

      await disk.mint()

      await baseWrite.contribute(1, 1, 25);
      const story = await baseWrite.stories(1)
      const charactersUsed = await baseWrite.charactersUsed(1, owner.address)

      expect(Number(story.totalContributions)).to.eql(1);
      expect(Number(charactersUsed)).to.eql(25)
    });

    it('emits event on contribution', async () => {
      const { baseWrite, owner, disk } = await loadFixture(deployAndSet);
      await disk.mint()
      await expect(baseWrite.contribute(1, 1, 25))
        .to.emit(baseWrite, 'ContributionCreated')
        .withArgs(1, 1, owner.address, 25);
    });

    it('tracks usage per token', async () => {
      const { baseWrite, owner, disk } = await loadFixture(deployAndSet)

      await disk.mint() // token 1
      await disk.mint() // token 2

      // story 1, token 1, length 10
      await baseWrite.contribute(1, 1, 10)
      await baseWrite.contribute(1, 2, 50)

      const token1Count = await baseWrite.tokenIdToCharacterCount(1, 1)
      const token2Count = await baseWrite.tokenIdToCharacterCount(1, 2)

      const charactersUsed = await baseWrite.charactersUsed(1, owner.address)

      expect(Number(token1Count)).to.eql(10)
      expect(Number(token2Count)).to.eql(50)
      expect(Number(charactersUsed)).to.eql(60)
    })
  });

  // --- Validation & Error Handling ---
  describe('Validation and Errors', function () {
    it('reverts if caller is not the diskId owner', async () => {
      const { baseWrite, otherAccount, disk } = await loadFixture(deployAndSet);

      await disk.connect(otherAccount).mint();

      await expect(baseWrite.contribute(1, 1, 25))
        .to.be.revertedWith('Not owner');
    });

    it('reverts if diskId does not exist', async () => {
      const { baseWrite } = await loadFixture(deployAndSet);
      await expect(baseWrite.contribute(1, 1, 25)).to.be.reverted;
    });

    it('reverts if contribution exceeds available characters', async () => {
      const { baseWrite, disk, owner } = await loadFixture(deployAndSet);

      await disk.connect(owner).mint();

      await expect(baseWrite.contribute(1, 1, 101))
        .to.be.revertedWith('Not enough characters');
    });

    it('reverts if contributing to inactive story', async () => {
      const { baseWrite }  = await loadFixture(deployAndSet)
      await expect(baseWrite.contribute(2,1,50))
        .to.be.revertedWith('Story not active')
    })
  });
});
