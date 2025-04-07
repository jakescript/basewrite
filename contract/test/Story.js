const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe('Story', function () {
  async function deployAndSet() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Disk = await ethers.getContractFactory("Disk");
    const disk = await Disk.deploy(100);

    const Story = await ethers.getContractFactory("Story");
    const story = await Story.deploy(disk.target);

    return { story, disk, owner, otherAccount };
  }

  // --- Deployment Tests ---
  describe('Deployment', function () {
    it('sets the owner on deploy', async () => {
      const { story, owner } = await loadFixture(deployAndSet);
      expect(await story.owner()).to.equal(owner.address);
    });

    it('starts with first story active', async () => {
      const { story } = await loadFixture(deployAndSet);
      const currentStory = await story.storyCount();
      const isActive = await story.isActive(Number(currentStory));

      expect(isActive).to.equal(true);
      expect(Number(currentStory)).to.equal(1);
    });
  });

  // --- Access Control ---
  describe('Access Control', function () {
    it('only owner can start a story', async () => {
      const { story, otherAccount } = await loadFixture(deployAndSet);

      await expect(story.connect(otherAccount).startStory())
        .to.be.revertedWithCustomError(story, 'OwnableUnauthorizedAccount')
        .withArgs(otherAccount.address);
    });
  });

  // --- Contribution Functionality ---
  describe('Contributions', function () {
    it('allows contributing to a story', async () => {
      const { story, disk, owner } = await loadFixture(deployAndSet);

      await disk.mint()

      await story.contribute(1, 25);
      const contributions = await story.getContributions(1);

      expect(contributions.length).to.eql(1);

      expect(contributions[0].author).to.equal(owner.address)
      expect(contributions[0].tokenId).to.equal(1)
      expect(contributions[0].count).to.equal(25)
    });

    it('emits event on contribution', async () => {
      const { story, owner, disk } = await loadFixture(deployAndSet);

      await disk.mint()

      await expect(story.contribute(1, 25))
        .to.emit(story, 'ContributionCreated')
        .withArgs(1, owner.address, 25);
    });

    it('allows disk owners to contribute using owned diskId', async () => {
      const { story, disk, owner } = await loadFixture(deployAndSet);
      await disk.connect(owner).mint();
      await story.contribute(1, 10);
      const contributions = await story.getContributions(1);

      expect(contributions[0].author).to.equal(owner.address);
    });
  });

  // --- Validation & Error Handling ---
  describe('Validation and Errors', function () {
    it('reverts if caller is not the diskId owner', async () => {
      const { story, otherAccount, disk } = await loadFixture(deployAndSet);

      await disk.connect(otherAccount).mint();

      await expect(story.contribute(1, 25))
        .to.be.revertedWith('Not owner');
    });

    it('reverts if diskId does not exist', async () => {
      const { story } = await loadFixture(deployAndSet);
      await expect(story.contribute(1, 25)).to.be.reverted;
    });

    it('reverts if contribution exceeds available characters', async () => {
      const { story, disk, owner } = await loadFixture(deployAndSet);

      await disk.connect(owner).mint();

      await expect(story.contribute(1, 101))
        .to.be.revertedWith('Not enough characters');
    });
  });
});
