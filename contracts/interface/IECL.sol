// contracts/IECL.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IECL is IERC721Enumerable {    
    function getHoursToReveal(uint256 _tokenId) external view returns(uint256);
    function _tokenIdToHash(uint256 _tokenId) external view returns (string memory);
    function mintToMike(uint256 tokenId) external view returns (uint16);
    function getStaker(uint16 tokenId) external view returns (address);
    function getPowerLevel(uint256 tokenId) external view returns (uint16);
}