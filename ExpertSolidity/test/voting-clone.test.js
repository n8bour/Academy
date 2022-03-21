const { expect } = require('chai');
const { Contract } = require('ethers');
const { ethers } = require('hardhat');

let owner, voterClone, voterCloned, clonedAddress;

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then((f) => f.deployed());
}

describe('Voting Factory', async () => {
  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    voterClone = await deploy('VoterClone');
    await voterClone.initialize(owner.address);
    await voterClone.cloneContract();
  });

  it('Generates contract and measures gas', async () => {
    console.log(await voterClone.estimateGas.cloneContract());
  });

  it('Checks functionality of cloned contract', async () => {
    clonedAddress = await voterClone.voters(0);
    voterCloned = await (
      await ethers.getContractFactory('VoterClone')
    ).attach(clonedAddress);
    await voterCloned.initialize(owner.address);
    await voterCloned.nextStage();
    await voterCloned.increment();
    expect(await voterCloned.getCount()).to.equal(1);
  });
});
