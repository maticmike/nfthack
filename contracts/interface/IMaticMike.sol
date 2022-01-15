// contracts/IMaticMike.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";


interface IMaticMike is IERC721Enumerable {    
    function withdrawnTokens(uint256 tokenId) external view returns (bool);
    function getPowerLevel(uint256 tokenId) external view returns (uint16);
    function _tokenIdToHash(uint256 _tokenId) external view returns (string memory);
}
