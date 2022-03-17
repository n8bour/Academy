// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./DogCoinUups.sol";

contract DogCoinUupsV2 is DogCoinUups {
    function DogCoinUupsVersion() external pure returns (uint256) {
        return 2;
    }
}
