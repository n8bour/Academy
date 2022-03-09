// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract DogCoin01 is IERC20 {
    using SafeMath for uint256;

    string public constant name = "DogCoin";
    string public constant symbol = "DOG";
    uint8 public constant decimals = 18;

    address[] holders;

    mapping(address => uint256) balances;
    mapping(address => uint256) holderLocation;
    mapping(address => mapping(address => uint256)) allowed;

    event HolderAdded(address indexed holder);
    event HolderRemoved(address indexed holder);

    uint256 totalSupply_;

    constructor(uint256 total) {
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
        console.log("holderLocation[_holder]", _holderIndex);

        console.log("holders[0]", holders[0]);

        address _toShift = holders[_holderIndex - 1];
        console.log("holders[_holderIndex - 1]", _toShift);

        if (_holderIndex != 0) {
            uint256 lastIndex = holders.length - 1;
            console.log(lastIndex);
            console.log(holders[lastIndex]);
            if (lastIndex != _holderIndex) {
                console.log("Going into loop");
                // Update holderLocation mapping
                holderLocation[_toShift] = _holderIndex;
                // Update holders
                holders[_holderIndex - 1] = holders[lastIndex];
            }
            holders.pop();
        }
        emit HolderRemoved(_holder);
    }

    function approve(address delegate, uint256 numTokens)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate)
        public
        view
        override
        returns (uint256)
    {
        return allowed[owner][delegate];
    }

    function transferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
