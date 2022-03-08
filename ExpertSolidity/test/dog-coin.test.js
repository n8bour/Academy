const { expect } = require("chai");
const { Contract } = require('ethers');
const { ethers } = require("hardhat");

let owner, exhOwner, exhOwner2, dogCoin;

describe("DogCoin", async () => {
  beforeEach(async () => {
    [owner, exhOwner, exhOwner2] = await ethers.getSigners();
    const DogCoin = await ethers.getContractFactory("DogCoin");
    dogCoin = await Exhibitions.deploy();
  });

  it("Mint tokens and save owner to array", async () => {

  })
})