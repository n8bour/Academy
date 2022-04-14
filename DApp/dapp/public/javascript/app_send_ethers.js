// Library dependency
const { ethers } = require('ethers');

// Smart contract ABI
const nftAbi = require('../../build/contracts/EncodeErc721.json');
const nftAddress = '0xA97409103E409f93ecB7599C8d2f13a1845049EB';

// Initialise ethers library
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

// Set variable here for reuse
const ownerPub = '0x536F8222C676b6566FF34E539022De6c1c22cc06';
const ownerPriv =
  '4e05f623e5e7a057db5b80d8f3ae73f9efac3595ae02efca0df1f0e25222439b';

// Add credentials
const wallet = new ethers.Wallet(ownerPriv);

// Connect
const signer = wallet.connect(provider);

// Initialise contract
const encodeNft = new ethers.Contract(nftAddress, nftAbi, signer);

(async () => {
  // Get contract name
  const mint = await encodeNft.mintToken(ownerPub, 'abc.com');

  // Log tx info
  console.log(mint);
})();
