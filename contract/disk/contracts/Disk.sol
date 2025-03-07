// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract Disk is ERC721URIStorage {
    uint public counter;

    constructor() ERC721("Boba", "BBB") {
        console.log('constructor');
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
