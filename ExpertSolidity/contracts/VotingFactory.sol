// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Voter {
    uint256 private _count;
    address private _owner;
    address private _factory;

    modifier onlyOwner(address caller) {
        require(caller == _owner, "You're not the owner of the contract");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == _factory, "You need to use the factory");
        _;
    }

    constructor(address owner) {
        _owner = owner;
        _factory = msg.sender;
    }

    function getCount() public view returns (uint256) {
        return _count;
    }

    function increment(address caller) public onlyFactory onlyOwner(caller) {
        _count++;
    }
}

contract VotingFactory {
    mapping(address => Voter) _voters;

    function createVoter() public {
        require(
            _voters[msg.sender] == Voter(address(0)),
            "Voting Contract already owned"
        );
        _voters[msg.sender] = new Voter(msg.sender);
    }

    function increment() public {
        require(_voters[msg.sender] != Voter(address(0)));
        Voter(_voters[msg.sender]).increment(msg.sender);
    }

    function getCount(address account) public view returns (uint256) {
        require(_voters[account] != Voter(address(0)));
        return (_voters[account].getCount());
    }

    function getMyCount() public view returns (uint256) {
        return (getCount(msg.sender));
    }
}
