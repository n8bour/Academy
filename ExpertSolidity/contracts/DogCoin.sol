// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract DogCoin is ERC20 {
    using SafeMath for uint256;

    address[] internal holders;

    mapping(address => uint256) internal balances;
    mapping(address => uint256) internal holderLocation;
    mapping(address => mapping(address => uint256)) internal allowed;

    event HolderAdded(address indexed holder);
    event HolderRemoved(address indexed holder);

    uint256 internal totalSupply_;

    constructor(uint256 total) ERC20("DogCoin", "DOG") {
        totalSupply_ = total;
        balances[msg.sender] = totalSupply_;
        holders.push(msg.sender);
        holderLocation[msg.sender] = holders.length;
    }

    function totalSupply() public view override returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner)
        public
        view
        override
        returns (uint256)
    {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens)
        public
        override
        returns (bool)
    {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        // Add to array
        if (holderLocation[receiver] == 0) {
            holders.push(receiver);
            holderLocation[receiver] = holders.length;
        }
        // Remove from array if zero balance
        if (balances[msg.sender] == 0) {
            removeFromArray(msg.sender);
        }
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function holdersLength() public view returns (uint256) {
        return holders.length;
    }

    function holdersArrayLocation(address _holder)
        public
        view
        returns (uint256)
    {
        return holderLocation[_holder];
    }

    function removeFromArray(address _holder) internal {
        uint256 _holderIndex = holderLocation[_holder];
        address _toShift = holders[_holderIndex - 1];

        // Update holderLocation mapping
        holderLocation[_toShift] = 0;

        if (_holderIndex != 0) {
            uint256 lastIndex = holders.length - 1;
            if (lastIndex != _holderIndex - 1) {
                // Update holders
                holders[_holderIndex - 1] = holders[lastIndex];
            }
            holders.pop();
        }
        emit HolderRemoved(_holder);
    }

    function removeFromArrayLoop(address _holder) internal {

        for (uint256 index = 0; index < holders.length - 1; index++) {
            if (holders[index] == _holder) {
                if (index != holders.length - 1) {
                    holders[index] = holders[holders.length - 1];
                }
                holders.pop();
            }
        }
        emit HolderRemoved(_holder);
    }
}
