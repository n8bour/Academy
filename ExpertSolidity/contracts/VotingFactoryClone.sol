// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "hardhat/console.sol";

contract VoterClone {
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

    modifier onlyOwner() {
        require(msg.sender == _owner, "You're not the owner of the contract");
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

    constructor() {
        _owner = msg.sender;
    }

    function getCount() public view returns (uint256) {
        return _vote;
    }

    function increment() public onlyOwner atStage(Stages.Voting) {
        _vote++;
    }

    function decrement() public onlyOwner atStage(Stages.Voting) {
        _vote--;
    }

    function nextStage() public onlyOwner {
        stage = Stages(uint256(stage) + 1);
    }

    function cloneContract() external returns (address child) {
         child = Clones.clone(address(this));
        // console.log("address");
        // console.log(child);
        // return child;
    }
}
