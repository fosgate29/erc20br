import { ethers } from "hardhat";
import { Signer } from "ethers";
import { Contract } from "ethers";

import chai, { expect } from "chai";
import { waffleChai } from "@ethereum-waffle/chai";
chai.use(waffleChai);

describe("Token", function () {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let accounts: Signer[];
  let tokenERC20br: Contract;
  let owner: Signer;
  let bob: Signer;
  let alice: Signer;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    bob = accounts[1];
    alice = accounts[2];
    const ERC20br = await ethers.getContractFactory("ERC20br");

    tokenERC20br = await ERC20br.deploy();
  });

  it("should deploy correct values", async function () {
    const ownerBalance = await tokenERC20br.balanceOf(owner.getAddress());
    expect(await tokenERC20br.totalSupply()).to.equal(ownerBalance);

    const bobBalance = await tokenERC20br.balanceOf(bob.getAddress());
    expect(0).to.equal(bobBalance);

    const name = await tokenERC20br.name();
    const symbol = await tokenERC20br.symbol();
    const decimals = await tokenERC20br.decimals();
    const totalSupply = await tokenERC20br.totalSupply();

    expect(name).to.equal("ERC20br");
    expect(symbol).to.equal("2BR");
    expect(decimals).to.equal(18);
    expect(totalSupply).to.equal("8516000000000000000000000");
  });

  it("should transfer tokens to another account", async function () {
    await expect(tokenERC20br.transfer(ZERO_ADDRESS, 10)).to.be.revertedWith(
      "ERC20: transfer to the zero address"
    );

    const initialOwnerBalance = await tokenERC20br.balanceOf(
      owner.getAddress()
    );

    await expect(
      tokenERC20br.connect(bob).transfer(alice.getAddress(), 10)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    await tokenERC20br.transfer(
      bob.getAddress(),
      ethers.BigNumber.from("516000000000000000000000")
    );

    const bobBalance = await tokenERC20br.balanceOf(bob.getAddress());
    expect(ethers.BigNumber.from("516000000000000000000000")).to.equal(
      bobBalance
    );

    const ownerBalance = await tokenERC20br.balanceOf(owner.getAddress());
    expect(initialOwnerBalance.sub(bobBalance)).to.equal(ownerBalance);
  });

  it("should transfer from another account", async function () {
    await expect(
      tokenERC20br
        .connect(alice)
        .transfer(bob.getAddress(), "500000000000000000000000")
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    await tokenERC20br.transfer(
      alice.getAddress(),
      ethers.BigNumber.from("516000000000000000000000")
    );

    const aliceBalance = await tokenERC20br.balanceOf(alice.getAddress());
    expect(ethers.BigNumber.from("516000000000000000000000")).to.equal(
      aliceBalance
    );

    const aliceAllowance = await tokenERC20br.allowance(
      alice.getAddress(),
      owner.getAddress()
    );
    expect(0).to.equal(aliceAllowance);

    await expect(
      tokenERC20br.transferFrom(
        alice.getAddress(),
        bob.getAddress(),
        "500000000000000000000000"
      )
    ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");

    await expect(
      tokenERC20br.connect(alice).approve(ZERO_ADDRESS, 10)
    ).to.be.revertedWith("ERC20: approve to the zero address");

    await expect(
      tokenERC20br
        .connect(alice)
        .approve(owner.getAddress(), "616000000000000000000000")
    ).to.be.revertedWith("ERC20: approval amount exceeds balance");

    await tokenERC20br
      .connect(alice)
      .approve(owner.getAddress(), "51600000000000000000000");
    let ownerAliceAllowance = await tokenERC20br.allowance(
      alice.getAddress(),
      owner.getAddress()
    );
    expect("51600000000000000000000").to.equal(ownerAliceAllowance);

    await expect(
      tokenERC20br.transferFrom(
        ZERO_ADDRESS,
        bob.getAddress(),
        "51600000000000000000000"
      )
    ).to.be.revertedWith("ERC20: transfer from the zero address");

    await expect(
      tokenERC20br.transferFrom(
        alice.getAddress(),
        ZERO_ADDRESS,
        "51600000000000000000000"
      )
    ).to.be.revertedWith("ERC20: transfer to the zero address");

    await expect(
      tokenERC20br.transferFrom(
        alice.getAddress(),
        bob.getAddress(),
        "61600000000000000000000"
      )
    ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");

    await tokenERC20br.transferFrom(
      alice.getAddress(),
      bob.getAddress(),
      "41600000000000000000000"
    );

    ownerAliceAllowance = await tokenERC20br.allowance(
      alice.getAddress(),
      owner.getAddress()
    );
    expect("10000000000000000000000").to.equal(ownerAliceAllowance);

    const finalBobBalance = await tokenERC20br.balanceOf(bob.getAddress());
    const finalAliceBalance = await tokenERC20br.balanceOf(alice.getAddress());

    expect(ethers.BigNumber.from("41600000000000000000000")).to.equal(
      finalBobBalance
    );
    expect(
      ethers.BigNumber.from("516000000000000000000000").sub(finalBobBalance)
    ).to.equal(finalAliceBalance);

    await tokenERC20br
      .connect(alice)
      .transfer(
        bob.getAddress(),
        ethers.BigNumber.from("474400000000000000000000")
      );
    await expect(
      tokenERC20br.transferFrom(
        alice.getAddress(),
        bob.getAddress(),
        "10000000000000000000000"
      )
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
});
