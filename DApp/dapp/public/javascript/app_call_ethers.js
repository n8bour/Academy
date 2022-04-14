// Library dependency
const { ethers } = require('ethers');

// Smart contract ABI
const nftAbi = require('../../build/contracts/EncodeErc721.json');
const nftAddress = '0xA97409103E409f93ecB7599C8d2f13a1845049EB';

// Initialise ethers library
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

// Set variable here for reuse
const ownerPub = '0x536F8222C676b6566FF34E539022De6c1c22cc06';

// Initialise contract
const encodeNft = new ethers.Contract(nftAddress, nftAbi, provider);

// Make call
(async () => {
  //   Get contract name
  const name = await encodeNft.name();

  console.log(name);

  // Get balance
  const balance = await encodeNft.balanceOf(ownerPub);

  // Log balance
  console.log(balance.toString());
})();
