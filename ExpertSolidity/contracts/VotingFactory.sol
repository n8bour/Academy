// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Voter {
    enum Stages {
        Proposed,
        Voting,
        Accepted,
        Rejected
    }

    error currentToRequiredStageMismatch(
        uint256 _currentStage,
        uint256 _requiredStage
    );

    Stages public stage = Stages.Proposed;
    uint256 public creationTime = block.timestamp;

    uint256 private _vote;
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

    modifier atStage(Stages _stage) {
        if (stage != _stage)
            revert currentToRequiredStageMismatch(
                uint256(stage),
                uint256(_stage)
            );
        _;
    }

    constructor(address owner) {
        _owner = owner;
        _factory = msg.sender;
    }

    function getCount() public view returns (uint256) {
        return _vote;
    }

    function increment(address caller)
        public
        onlyFactory
        onlyOwner(caller)
        atStage(Stages.Voting)
    {
        _vote++;
    }

    function decrement(address caller)
        public
        onlyFactory
        onlyOwner(caller)
        atStage(Stages.Voting)
    {
        _vote--;
    }

    function nextStage(address caller) public onlyFactory onlyOwner(caller) {
        stage = Stages(uint256(stage) + 1);
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

    function decrement() public {
        require(_voters[msg.sender] != Voter(address(0)));
        Voter(_voters[msg.sender]).decrement(msg.sender);
    }

    function getCount(address account) public view returns (uint256) {
        require(_voters[account] != Voter(address(0)));
        return (_voters[account].getCount());
    }

    function getMyCount() public view returns (uint256) {
        return (getCount(msg.sender));
    }

    function nextState() public {
        _voters[msg.sender].nextStage(msg.sender);
    }
}
