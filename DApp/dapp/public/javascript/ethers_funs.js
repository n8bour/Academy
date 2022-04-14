const { ethers } = require('ethers');

// Set variables here for reuse
const ownerPub = process.env.OWNER_PUB;
// const erc721Address = '0x457Ddf4b4853C64BbbfA63bADa62092E93577B13' // Rinkeby
const erc721Address = '0xb93F00768EcB02d0ED20Efa7375e011Be5F71ab3'; //'0xA97409103E409f93ecB7599C8d2f13a1845049EB'; // Ganache

let provider;
let encodeNft;
let signer;
let signer2;
async function init() {
  // Smart contract ABI
  const nftAbi = require('../../build/contracts/EncodeErc721.json');
  // Initialise web3 library
  //  provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RINKEBY)
  provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

  // Add credentials
  const wallet = new ethers.Wallet(process.env.OWNER_PRIV);
  const wallet2 = new ethers.Wallet(process.env.OWNER_PRIV2);

  // Connect
  signer = wallet.connect(provider);
  signer2 = wallet2.connect(provider);

  // Initialise contract
  encodeNft = new ethers.Contract(erc721Address, nftAbi, signer);

  console.log('Web3 connection initialised.');
}

const web3Funs = {
  async getSigner(account) {
    if (account == (await signer.address)) {
      return signer;
    } else {
      return signer2;
    }
  },

  async mintNft(params) {
    const _rx = params.receiver || ownerPub;
    const _signer = await web3Funs.getSigner(params.sender);
    console.log(_signer);
    try {
      const mint = await encodeNft.connect(_signer).safeMint(_rx, params.uri);
      return { 0: mint.hash };
    } catch (e) {
      console.log(e.toString());
    }
  },

  async getNfts(address) {
    try {
      const nfts = await encodeNft.getNfts(address);
      let nftArr = [];
      for (const tokenId of nfts) {
        if (tokenId.toString() != 0) {
          nftArr.push({ [tokenId]: await web3Funs.getUri(tokenId) });
        }
      }
      return { 0: nftArr };
    } catch (e) {
      console.log(e.toString());
    }
  },

  async getUri(tokenId) {
    try {
      const uri = await encodeNft.tokenURI(tokenId);
      return await uri;
    } catch (e) {
      console.log(e.toString());
    }
  },

  async transferNft(params) {
    const _signer = await web3Funs.getSigner(params.sender);
    try {
      const transfer = await encodeNft
        .connect(_signer)
        .transferNft(params.from, params.to, params.tokenId, {
          gasLimit: 1000000,
        });
      return { 0: transfer.hash };
    } catch (e) {
      console.log(e.toString());
    }
  },
};
init();

module.exports = web3Funs;
