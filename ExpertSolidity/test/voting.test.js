const { expect } = require('chai');
const { Contract } = require('ethers');
const { ethers } = require('hardhat');

let owner, exhOwner, exhOwner2, votingFactory;

describe('Voting Factory', async () => {
  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const VotingFactory = await ethers.getContractFactory('VotingFactory');
    votingFactory = await VotingFactory.deploy();
  });

  it("Doesn't allow change of state without a contract", async () => {
    await expect(votingFactory.increment()).to.be.reverted;
  });

  it("Generates contract, and can't increments", async () => {
    await votingFactory.createVoter();
    await expect(votingFactory.increment()).to.be.reverted;
  });

  it('Generates contract, changes state and increments', async () => {
    await votingFactory.createVoter();
    await votingFactory.nextState();
    await votingFactory.increment();
    const votes = await votingFactory.getMyCount();
    expect(votes).to.equal(1);
  });
});
