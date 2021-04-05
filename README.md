# erc20br

- https://rinkeby.etherscan.io/address/0x2ecd87000f36dae2734ed9f7f54ece22847e428e

## ERC20 Token

I reused part of the code from OpenZeppelin. I implemented https://eips.ethereum.org/EIPS/eip-20 functions and events.

- There is a "mint" function so you can mint tokens for tests. It is not safe,
but it is just for tests purposes.
- Smart Contract is not using "SafeMath" because at first I implemented using sol 0.8.3. But Slither didn't work with that version so I downgrade to 0.7.6.