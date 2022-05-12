const { expect, use, assert } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
const { SWAP_ROUTER_ABI } = require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const POOLAddress = "0x6c6Bc977E13Df9b0de53b251522280BB72383700";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = 999999999000000;
  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    const symbol = await DAI_TokenContract.symbol();
    console.log(symbol);
    const DeFi = await ethers.getContractFactory("DeFi");

    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      BigInt(INITIAL_AMOUNT)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {
    //console.log(DeFi_Instance);
    let balance = await DAI_TokenContract.balanceOf(owner.address);
    console.log(balance);
    assert(balance >= INITIAL_AMOUNT);

  });
  it("should sendDAI to contract", async () => {
    let preContractBalance = await DAI_TokenContract.balanceOf(DAI_TokenContract.address);
    let preOwnerBalance = await DAI_TokenContract.balanceOf(owner.address);
    console.log(preContractBalance);
    console.log(preOwnerBalance);
    await DAI_TokenContract.connect(owner).transfer(
      DAI_TokenContract.address,
      BigInt(INITIAL_AMOUNT)
    );
    let contractBalance = await DAI_TokenContract.balanceOf(DAI_TokenContract.address);
    let ownerBalance = await DAI_TokenContract.balanceOf(owner.address);
    console.log(contractBalance);
    console.log(ownerBalance);

    assert(contractBalance > preContractBalance && ownerBalance < preOwnerBalance);
  });
  it("should make a swap", async () => {
    
    const swapContract = await ethers.getContractAt(
      "ERC20",
      "0xE592427A0AEce92De3Edee1F18E0157C05861564");

     let tx = await swapContract.connect(owner).exactInputSingle(
        {
          tokenIn:USDCAddress,
          tokenOut:DAIAddress,
          fee: 300,
          recipient: owner.address,
          deadline:Math.floor((Date.now()/1000) +(60 *10)),
          amountIn: INITIAL_AMOUNT - 1111111111,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0,

        }
      )
        console.log(tx);
  });
});
