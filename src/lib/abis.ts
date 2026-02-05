// src/lib/abis.ts

export const ERC20_ABI = [
  // Read
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",

  // Write
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
];

export const PRICE_ROUTER_ABI = [
  // BUY
  "function buy(address user,uint256 tokenAmount,uint256 usdcAmount,uint256 expiry,uint256 nonce,bytes signature)",

  // SELL
  "function sell(address user,uint256 tokenAmount,uint256 usdcAmount,uint256 expiry,uint256 nonce,bytes signature)",
];

