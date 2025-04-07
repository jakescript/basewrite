// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.2 < 0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

interface IDisk is IERC721 {
  function getRemainingChars(uint tokenId) external view returns (uint);
  function tokenCount() external view returns (uint);
}

contract Story is ERC721URIStorage, Ownable {
  IDisk public disk;
  uint public storyCount;

  struct Contribution {
    uint tokenId;
    address author;
    uint count;
  }

  mapping(uint storyId => Contribution[]) public contributions;
  mapping(uint storyId => bool) public isActive;

  event ContributionCreated(
    uint tokenId,
    address author,
    uint count
  );

  constructor(address diskAddress) ERC721("STORY", "SOB") Ownable(msg.sender) {
    disk = IDisk(diskAddress);
    startStory();
  }

  function startStory() public onlyOwner {
    require(!isActive[storyCount], 'Story already active');
    storyCount++;
    isActive[storyCount] = true;
  }

  function contribute(uint diskId, uint length) public {
    require(msg.sender == disk.ownerOf(diskId), 'Not owner');
    require(length <= disk.getRemainingChars(diskId), 'Not enough characters');

    contributions[storyCount].push(Contribution({
      tokenId: diskId,
      author: msg.sender,
      count: length
    }));

    emit ContributionCreated(diskId, msg.sender, length);
  }

  function getContributions(uint storyId) public view returns (Contribution[] memory) {
    return contributions[storyId];
  }

  function _baseURI() internal pure override returns (string memory) {
      return "https://basewrite-nine.vercel.app/api/metadata/";
  }
} 
