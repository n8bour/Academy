const { expect } = require('chai');
const { Contract } = require('ethers');
const { ethers } = require('hardhat');

let owner, voterClone, voterCloned;

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then((f) => f.deployed());
}

describe('Voting Factory', async () => {
  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    voterClone = await deploy('VoterClone');
    voterCloned = await voterClone.cloneContract();
  });

  it('Generates contract and measures gas', async () => {
    console.log(await voterClone.estimateGas.cloneContract());
  });

  it('Checks functionality of cloned contract', async () => {
    const count = await voterCloned.getCount();
    console.log(count);
  });
});
