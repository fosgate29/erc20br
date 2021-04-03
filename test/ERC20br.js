const { expect } = require("chai");
const { toBN } = ethers.BigNumber;

describe("ERC20br contract", function() {

  let tokenERC20br;
  let owner, bob, alice;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async () => {
    [owner, bob, alice] = await ethers.getSigners();

    const ERC20br = await ethers.getContractFactory("ERC20br");

    tokenERC20br = await ERC20br.deploy();
  });

  it("should deploy correct values", async function() {

    const ownerBalance = await tokenERC20br.balanceOf(owner.address);
    expect(await tokenERC20br.totalSupply()).to.equal(ownerBalance);

    const bobBalance = await tokenERC20br.balanceOf(bob.address);
    expect(0).to.equal(bobBalance);

    const name = await tokenERC20br.name();
    const symbol = await tokenERC20br.symbol();
    const decimals = await tokenERC20br.decimals();
    const totalSupply = await tokenERC20br.totalSupply();

    expect(name).to.equal('ERC20br');
    expect(symbol).to.equal('2BR');
    expect(decimals).to.equal(18);
    expect(totalSupply).to.equal('8516000000000000000000000');

  });

  it("should transfer tokens to another account", async function() {

    await expect(
        tokenERC20br.transfer(ZERO_ADDRESS, 10)
      ).to.be.revertedWith("ERC20: transfer to the zero address");


    const initialOwnerBalance = await tokenERC20br.balanceOf(owner.address);
    const initialBobBalance = await tokenERC20br.balanceOf(bob.address);

    await expect(
        tokenERC20br.connect(bob).transfer(alice.address, 10)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    await tokenERC20br.transfer(bob.address, ethers.BigNumber.from('516000000000000000000000'));

    const bobBalance = await tokenERC20br.balanceOf(bob.address);
    expect(ethers.BigNumber.from('516000000000000000000000')).to.equal(bobBalance);

    const ownerBalance = await tokenERC20br.balanceOf(owner.address);
    expect(initialOwnerBalance.sub(bobBalance)).to.equal(ownerBalance);

  });
  

  it("should transfer from another account", async function() {

    const initialOwnerBalance = await tokenERC20br.balanceOf(owner.address);
    const initialBobBalance = await tokenERC20br.balanceOf(bob.address);
    const initialAliceBalance = await tokenERC20br.balanceOf(alice.address);

    await expect(
        tokenERC20br.connect(alice).transfer(bob.address, '500000000000000000000000')
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    await tokenERC20br.transfer(alice.address, ethers.BigNumber.from('516000000000000000000000'));

    const aliceBalance = await tokenERC20br.balanceOf(alice.address);
    expect(ethers.BigNumber.from('516000000000000000000000')).to.equal(aliceBalance);

    const aliceAllowance =  await tokenERC20br.allowance(alice.address, owner.address);
    expect(0).to.equal(aliceAllowance);
        
    await expect(
        tokenERC20br.transferFrom(alice.address, bob.address, '500000000000000000000000')
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");

    await expect(
        tokenERC20br.connect(alice).approve(ZERO_ADDRESS, 10)
      ).to.be.revertedWith("ERC20: approve to the zero address");

    await expect(
        tokenERC20br.connect(alice).approve(owner.address, '616000000000000000000000')
      ).to.be.revertedWith("ERC20: approval amount exceeds balance");      

    await tokenERC20br.connect(alice).approve(owner.address, '51600000000000000000000');
    let ownerAliceAllowance =  await tokenERC20br.allowance(alice.address, owner.address);
    expect('51600000000000000000000').to.equal(ownerAliceAllowance);

    await expect(
        tokenERC20br.transferFrom(ZERO_ADDRESS, bob.address, '51600000000000000000000')
        ).to.be.revertedWith("ERC20: transfer from the zero address");

    await expect(
        tokenERC20br.transferFrom(alice.address, ZERO_ADDRESS, '51600000000000000000000')
        ).to.be.revertedWith("ERC20: transfer to the zero address");        

    await expect(
        tokenERC20br.transferFrom(alice.address, bob.address, '61600000000000000000000')
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");    
    
    await tokenERC20br.transferFrom(alice.address, bob.address, '41600000000000000000000')

    ownerAliceAllowance =  await tokenERC20br.allowance(alice.address, owner.address);
    expect('10000000000000000000000').to.equal(ownerAliceAllowance);

    const finalBobBalance = await tokenERC20br.balanceOf(bob.address);
    const finalAliceBalance = await tokenERC20br.balanceOf(alice.address);

    expect(ethers.BigNumber.from('41600000000000000000000')).to.equal(finalBobBalance);
    expect(ethers.BigNumber.from('516000000000000000000000').sub(finalBobBalance)).to.equal(finalAliceBalance);

    await tokenERC20br.connect(alice).transfer(bob.address, ethers.BigNumber.from('474400000000000000000000'));
    await expect(
        tokenERC20br.transferFrom(alice.address, bob.address, '10000000000000000000000')
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

  });

});