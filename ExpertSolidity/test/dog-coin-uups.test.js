const { expect } = require('chai');
const { Contract } = require('ethers');
const { ethers } = require('hardhat');

let owner, exhOwner, exhOwner2, dogCoin;

const SUPPLY = 1000000000;

describe('DogCoinUups', async () => {
  beforeEach(async () => {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const DogCoinUups = await ethers.getContractFactory('DogCoinUups');
    dogCoinUups = await upgrades.deployProxy(DogCoinUups, [SUPPLY], {
      initializer: 'initialize',
    });
    await dogCoinUups.deployed();
    console.log('DogCoinUups deployed to:', dogCoinUups.address);
  });

  it('Checks the name, symbol and token supply', async () => {
    expect(await dogCoinUups.name()).to.equal('DogCoin');
    expect(await dogCoinUups.symbol()).to.equal('DOG');
    expect(await dogCoinUups.totalSupply()).to.equal(SUPPLY);
    expect(await dogCoinUups.version()).to.equal(1);
  });

  it('Mint tokens and save owner to array', async () => {
    const _startHolders = await dogCoinUups.holdersLength();
    const _startBal = await dogCoinUups.balanceOf(user1.address);

    await dogCoinUups.transfer(user1.address, 1);

    const _newBal = await dogCoinUups.balanceOf(user1.address);
    const _newHolders = await dogCoinUups.holdersLength();

    expect(_startBal).to.equal(_newBal.sub(ethers.BigNumber.from(1)));
    expect(_startHolders).to.equal(_newHolders.sub(ethers.BigNumber.from(1)));
  });

  it('Checks holder is removed from array when balance = 0', async () => {
    await dogCoinUups.transfer(user1.address, 1);

    const _startBalance = await dogCoinUups.balanceOf(user1.address);
    const _startHolders = await dogCoinUups.holdersLength();

    // Empty funds
    await dogCoinUups.connect(user1).transfer(owner.address, _startBalance);

    // Check user has been removed
    const _location2 = await dogCoinUups.holdersArrayLocation(user1.address);
    const _endHolders = await dogCoinUups.holdersLength();

    expect(_startHolders).to.equal(_endHolders.add(ethers.BigNumber.from(1)));
    expect(_location2).to.equal(0);
  });

  it('Estimates gas usage', async () => {
    await dogCoinUups.transfer(user1.address, 1);
    await dogCoinUups.transfer(user2.address, 1);
    await dogCoinUups.transfer(user3.address, 1);
    await dogCoinUups.transfer(user4.address, 1);

    const _startBalance = await dogCoinUups.balanceOf(user2.address);
    const _startHolders = await dogCoinUups.holdersLength();

    const estimation = await dogCoinUups
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

  it('Upgrades the smart contract to v2', async () => {
    const DogCoinUupsV2 = await ethers.getContractFactory('DogCoinUupsV2');
    const dogCoinUupsV2 = await upgrades.upgradeProxy(
      dogCoinUups.address,
      DogCoinUupsV2,
    );
    expect(await dogCoinUupsV2.DogCoinUupsVersion()).to.equal(2);
  });
});
