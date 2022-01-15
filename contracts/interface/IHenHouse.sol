// contracts/IHenHouse.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";


interface IHenHouse is IERC721Enumerable {    
    struct Staking {
        uint256 timestamp;
        address owner;
        uint16 stolen;
    }

    function stakings(uint256 _tokenId) external view returns (Staking memory);
}
