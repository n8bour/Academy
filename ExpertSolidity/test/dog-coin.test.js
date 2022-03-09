const { expect } = require('chai');
const { Contract } = require('ethers');
const { ethers } = require('hardhat');

let owner, exhOwner, exhOwner2, dogCoin;

const SUPPLY = 1000000000;

describe('DogCoin', async () => {
  beforeEach(async () => {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const DogCoin = await ethers.getContractFactory('DogCoin');
    dogCoin = await DogCoin.deploy(SUPPLY);
  });

  it('Checks the name, symbol and token supply', async () => {
    expect(await dogCoin.name()).to.equal('DogCoin');
    expect(await dogCoin.symbol()).to.equal('DOG');
    expect(await dogCoin.totalSupply()).to.equal(SUPPLY);
  });

  it('Mint tokens and save owner to array', async () => {
    const _startHolders = await dogCoin.holdersLength();
    const _startBal = await dogCoin.balanceOf(user1.address);

    await dogCoin.transfer(user1.address, 1);

    const _newBal = await dogCoin.balanceOf(user1.address);
    const _newHolders = await dogCoin.holdersLength();

    expect(_startBal).to.equal(_newBal.sub(ethers.BigNumber.from(1)));
    expect(_startHolders).to.equal(_newHolders.sub(ethers.BigNumber.from(1)));
  });

  it('Checks holder is removed from array when balance = 0', async () => {
    await dogCoin.transfer(user1.address, 1);

    const _startBalance = await dogCoin.balanceOf(user1.address);
    const _startHolders = await dogCoin.holdersLength();

    // Empty funds
    await dogCoin.connect(user1).transfer(owner.address, _startBalance);

    // Check user has been removed
    const _location2 = await dogCoin.holdersArrayLocation(user1.address);
    const _endHolders = await dogCoin.holdersLength();

    expect(_startHolders).to.equal(_endHolders.add(ethers.BigNumber.from(1)));
    expect(_location2).to.equal(0);
  });

  it.only('Estimates gas usage', async () => {
    await dogCoin.transfer(user1.address, 1);
    await dogCoin.transfer(user2.address, 1);
    await dogCoin.transfer(user3.address, 1);
    await dogCoin.transfer(user4.address, 1);

    const _startBalance = await dogCoin.balanceOf(user2.address);
    const _startHolders = await dogCoin.holdersLength();

    const estimation = await dogCoin
      .connect(user2)
      .estimateGas.transfer(owner.address, _startBalance);

    console.log(estimation);

    // const _endHolders = await dogCoin.holdersLength();

    // console.log(_startHolders);

    // console.log(_endHolders);

    // // const _location2 = await dogCoin.holdersArrayLocation(user2.address);
    // // expect(_location2).to.equal(0);
    // expect(_startHolders).to.equal(_endHolders.add(ethers.BigNumber.from(1)));
  });
});
