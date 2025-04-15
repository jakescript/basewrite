// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.2 < 0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IDisk is IERC721 {
  function getRemainingChars(uint tokenId) external view returns (uint);
  function tokenCount() external view returns (uint);
}

contract BaseWrite is ERC721URIStorage, Ownable {
  IDisk public disk;
  uint public storyCount;

  struct Story {
    bool isActive;
    uint totalRevisions;
    mapping(address => uint) charactersUsed;
    mapping(uint => uint) tokenIdToCharacterCount;
  }

  mapping(uint storyId => Story) public stories;

  event ContributionCreated(
    uint storyId,
    uint tokenId,
    address author,
    uint count
  );

  event StoryStarted(uint storyId);

  constructor(address diskAddress) ERC721("BaseWrite", "BWS") Ownable(msg.sender) {
    disk = IDisk(diskAddress);
    startStory();
  }

  function startStory() public onlyOwner {
    storyCount++;
    stories[storyCount].isActive = true;
    emit StoryStarted(storyCount);
  }

  function contribute(uint storyId, uint diskId, uint length) public {
    require(stories[storyId].isActive, 'Story not active');
    require(msg.sender == disk.ownerOf(diskId), 'Not owner');
    require(length <= disk.getRemainingChars(diskId), 'Not enough characters');

    Story storage story = stories[storyId];

    story.charactersUsed[msg.sender] += length;
    story.tokenIdToCharacterCount[diskId] += length;
    story.totalRevisions++;

    emit ContributionCreated(storyId, diskId, msg.sender, length);
  }

  function charactersUsed(uint storyId, address author) public view returns (uint) {
    return stories[storyId].charactersUsed[author];
  }

  function tokenIdToCharacterCount(uint storyId, uint diskId) public view returns (uint) {
    return stories[storyId].tokenIdToCharacterCount[diskId];
  }

  function _baseURI() internal pure override returns (string memory) {
      return "https://basewrite-nine.vercel.app/api/metadata/story/";
  }
} 
