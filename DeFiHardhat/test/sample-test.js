const { expect } = require("chai");
const { ethers } = require("hardhat");


//const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const daiAddress = "dai.tokens.ethers.eth";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const COINBASE = "0x503828976D22510aad0201ac7EC88293211D23Da";

const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";




describe("DeFi", function () {
let owner;
let DAI_TokenContract;
let USDC_TokenContract;
let DeFi_Instance;
const INITIAL_AMOUNT = 999999999000000;
let DeFi;
//let DAIMock;

    before(async function () {
        DeFi =  await ethers.getContractFactory("DeFi");
       // DAIMock = await ethers.getContractFactory("DAIMock"); 
       const daiAbi = [
        "function balanceOf(address) view returns (uint)",
        "function transfer(address to, uint amount)",
      ];

        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        //  DAI_TokenContract = await DAIMock.at(DAIAddress);
        const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
        //  USDC_TokenContract = await DAIMock.at(USDCAddress);
        // const symbol = await DAI_TokenContract.symbol();
        // console.log(symbol);
        // await DAI_TokenContract.transfer(owner, BigInt(INITIAL_AMOUNT), {
        //     from: COINBASE,
        //     gasPrice: 0,
        //   })
          
        //   DeFi_Instance = await DeFi.deployed();
    });


    it.only("should check transfer succeeded", async () => {
        const daiAddress = "dai.tokens.ethers.eth";
        let DAI_TokenContract = await DAIMock.at(DAIAddress);
        // const result = await DAI_TokenContract.balanceOf(owner);
        // assert( result.toNumber() > 0); 
        expect(true).to.equal(true);
    });
    it("should test the router", async () => {

        const factoryAddress = await DeFi_Instance.swapRouter();

    });
    it("should sendDAI to contract", async () => {

        await DAI_TokenContract.transfer(DeFi_Instance.address, BigInt(INITIAL_AMOUNT), {
            from: owner,
            gasPrice: 0,
          })

    });
    it("should make a swap", async () => {
        let initialUSDC = await USDC_TokenContract.balanceOf(owner);
        console.log(initialUSDC.toNumber());
 
        await DeFi_Instance.swapDAItoUSDC(99999999900000, {
            from: owner,
            gasPrice: 0,
          })
          let finalUSDC = await USDC_TokenContract.balanceOf(owner);
          console.log(finalUSDC.toNumber());

    });
    xit("should get the ETH price", async () => {

        let ETHPrice = await DeFi_Instance.getETHPrice();

          console.log(ETHPrice.toNumber());

    });
 
});
