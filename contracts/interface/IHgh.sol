// contracts/IHgh.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IHgh is IERC20 {
    function burnFrom(address account, uint256 amount) external;
    function getStaker(uint256 tokenId) external view returns (address);
    function expansionGetStaker(address _expansionAddress, uint256 tokenId) external view returns (address);
}