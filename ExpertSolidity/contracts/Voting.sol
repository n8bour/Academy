// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;


contract StateMachine {
    enum Stages {
        Proposal,
        Voting,
        Accepted,
        Rejected
    }

    /// Function cannot be called at this time.
    error functionInvalidAtThisStage();

    // This is the current stage.
    Stages public stage = Stages.Proposal;

    uint256 public creationTime = block.timestamp;

    modifier atStage(Stages _stage) {
        if (stage != _stage) revert functionInvalidAtThisStage();
        _;
    }


    // Perform timed transitions. Be sure to mention
    // this modifier first, otherwise the guards
    // will not take the new stage into account.
    modifier timedTransitions() {
        if (
            stage == Stages.Proposal &&
            block.timestamp >= creationTime + 10 days
        ) nextStage();
        if (stage == Stages.Voting && block.timestamp >= creationTime + 12 days)
            nextStage();
        // The other stages transition by transaction
        _;
    }

    // Order of the modifiers matters here!
    function bid() public payable timedTransitions atStage(Stages.Proposal) {
        // We will not implement that here
    }

    function reveal() public timedTransitions atStage(Stages.Voting) {}

    // This modifier goes to the next stage
    // after the function is done.
    modifier transitionNext() {
        _;
        nextStage();
    }

    function g()
        public
        timedTransitions
        atStage(Stages.Accepted)
        transitionNext
    {}

    function h()
        public
        timedTransitions
        atStage(Stages.Rejected)
        transitionNext
    {}

    function nextStage() internal {
        stage = Stages(uint256(stage) + 1);
    }
}
