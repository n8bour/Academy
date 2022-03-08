// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DogCoin is ERC20 {
    address[] public holders;

    constructor() ERC20("DogCoin", "DOG") {}
}
