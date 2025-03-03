// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Disk is ERC721URIStorage {
    uint public counter;

    constructor() ERC721("BaseWrite Disk", "BWD") {
        counter = 1;
    }

    function mint() external returns (uint) {
        _safeMint(msg.sender, counter);
        counter++;
        return counter;
    }

    function _baseURI() override internal view virtual returns (string memory) {
        return "https://basewrite-nine.vercel.app/api/metadata/";
    }
}
