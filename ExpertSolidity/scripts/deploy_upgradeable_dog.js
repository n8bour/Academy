const { ethers, upgrades } = require('hardhat');

async function main() {
  const DogCoinUups = await ethers.getContractFactory('DogCoinUups');
  console.log('Deploying DogCoinUups...');
  const dogCoinUups = await upgrades.deployProxy(DogCoinUups, [10000000000], {
    initializer: 'initialize',
  });
  await dogCoinUups.deployed();
  console.log('DogCoinUups deployed to:', dogCoinUups.address);
}

main();
