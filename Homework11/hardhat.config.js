require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// module.exports = {
//   defaultNetwork: 'ganache',
//   networks: {
//     ganache: {
//       // change URL to the URL from your Ganache. See README if the port is not 8545.
//       url: 'http://127.0.0.1:8545',
//       gasLimit: 6000000000,
//       defaultBalanceEther: 1000,
//     },
//   },
//   solidity: '0.8.0',
// };

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      fork: {
        url: "https://eth-mainnet.alchemyapi.io/v2/2icOJ-OQK4S4ZHLL3Hu8Xg8rgKjLTy7x",
      }
    },
  },
};
