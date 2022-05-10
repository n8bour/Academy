// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract DeFi { 
   ISwapRouter public immutable swapRouter;
  // AggregatorV3Interface internal priceFeed;


    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant ETHPriceContract = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

    uint24 public constant poolFee = 3000;
    event amountProduced (uint256);
 
 constructor() {
        swapRouter = ISwapRouter(address(0xE592427A0AEce92De3Edee1F18E0157C05861564));
      //  priceFeed = AggregatorV3Interface(ETHPriceContract);
    }


    function swapDAItoUSDC(uint256 amountIn) external returns (uint256 amountOut) {
             // Approve the router to spend DAI.
        TransferHelper.safeApprove(DAI, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: DAI,
                tokenOut: USDC,
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        emit amountProduced(amountOut);

    }

// function getETHPrice() external view returns (int256) {
//     (,int256 price,,,) = priceFeed.latestRoundData();
//         return price;
// }

 function contractState() external pure returns (string memory){
     return "created";
 }   

}

contract DAIMock is ERC20("XXX", "YYY"){ 

}