import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Kitai Pay", function () {
  let contractAddress: string;
  let ownerAddress: string;

  describe("Deployment", function () {
    it("Should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const KitaiPay = await ethers.getContractFactory("KitaiPay");
      const deploy = await KitaiPay.deploy();
      contractAddress = await deploy.getAddress();
      ownerAddress = await owner.getAddress();
    });
  });

  describe("Tokens", function () {
    it("Should send tokens", async function () {});
  });
});
