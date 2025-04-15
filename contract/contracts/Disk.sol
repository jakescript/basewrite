// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Disk is ERC721URIStorage, ERC721Enumerable, Ownable {
    uint public tokenCount;
    uint public defaultCharLimit;

    mapping(uint => uint) public charLimits;
    mapping(uint => uint) public usedChars;

    constructor(uint initalLimit) ERC721("DISK", "DOB") Ownable(msg.sender) {
        defaultCharLimit = initalLimit;
    }

    function mint() public returns (uint) {
        tokenCount++;
        charLimits[tokenCount] = defaultCharLimit;
        _safeMint(msg.sender, tokenCount);

        return tokenCount;
    }

    function updateDefaultLimit(uint newLimit) public onlyOwner {
      require(newLimit > 0, 'Default limit can not be zero');
      defaultCharLimit = newLimit;
    }

    function updateUsage(uint tokenId, uint amount) public returns (uint) {
      require(msg.sender == ownerOf(tokenId), 'Not the token owner');
      require(usedChars[tokenId] + amount <= charLimits[tokenId], 'No characters left');

      usedChars[tokenId] += amount;

      return usedChars[tokenId];
    }

    function getRemainingChars(uint tokenId) public view returns (uint) {
      return charLimits[tokenId] - usedChars[tokenId];
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://basewrite-nine.vercel.app/api/metadata/disk/";
    }

    function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
      return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
      return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
      return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
      super._increaseBalance(account, amount);
    }

}
