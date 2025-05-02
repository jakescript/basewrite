// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.2 < 0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IDisk is IERC721 {
  function charLimits(uint tokenId) external view returns (uint);
}

contract BaseWrite is ERC721URIStorage, Ownable {
  IDisk public disk;
  uint public storyCount;
  
  struct Story {
    bool isActive;
    uint256 startTime;
    mapping(address => uint) charactersUsed;
    mapping(uint => uint) tokenIdToCharacterCount;
  }

  mapping(uint storyId => Story) public stories;
  mapping(address => bool) public whitelistedAgents;
  
  event ContributionCreated(
    uint storyId,
    uint tokenId,
    address author,
    uint count,
    string contribution
  );

  event StoryStarted(uint storyId);
  event StoryEnded(uint storyId);
  event AgentWhitelisted(address agent);
  event AgentRemoved(address agent);

  constructor(address diskAddress) ERC721("BaseWrite", "BWS") Ownable(msg.sender) {
    disk = IDisk(diskAddress);
  }

  function whitelistAgent(address agent) external onlyOwner {
    whitelistedAgents[agent] = true;
    emit AgentWhitelisted(agent);
  }

  function removeAgent(address agent) external onlyOwner {
    whitelistedAgents[agent] = false;
    emit AgentRemoved(agent);
  }

  function startDailyStory() external onlyOwner {
    if (storyCount > 0) {
      require(!stories[storyCount].isActive, "Current story still active");
    }
    
    storyCount++;
    Story storage story = stories[storyCount];
    story.isActive = true;
    story.startTime = block.timestamp;
    
    emit StoryStarted(storyCount);
  }

  function contribute(uint storyId, uint diskId, uint length, string calldata contribution) external {
    require(stories[storyId].isActive, "Story not active");
    require(block.timestamp < stories[storyId].startTime + 1 days, "Story expired");

    Story storage story = stories[storyId];
    
    // If sender is a whitelisted agent, skip disk checks
    if (!whitelistedAgents[msg.sender]) {
      require(msg.sender == disk.ownerOf(diskId), "Not disk owner");
      story.tokenIdToCharacterCount[diskId] += length;
      require(story.tokenIdToCharacterCount[diskId] <= disk.charLimits(diskId), "Not enough characters");
    }

    story.charactersUsed[msg.sender] += length;
    emit ContributionCreated(storyId, diskId, msg.sender, length, contribution);
  }

  function endDailyStory(uint storyId) external onlyOwner {
    Story storage story = stories[storyId];
    require(story.isActive, "Story not active");
    require(block.timestamp >= story.startTime + 1 days, "Story still active");
    
    story.isActive = false;
    emit StoryEnded(storyId);
  }

  function charactersUsed(uint storyId, address author) external view returns (uint) {
    return stories[storyId].charactersUsed[author];
  }

  function tokenIdToCharacterCount(uint storyId, uint diskId) external view returns (uint) {
    return stories[storyId].tokenIdToCharacterCount[diskId];
  }

  function _baseURI() internal pure override returns (string memory) {
      return "https://basewrite-nine.vercel.app/api/metadata/story/";
  }
} 

