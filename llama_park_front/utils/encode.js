import { utils } from 'ethers';
import { convexConfig, dappConfig } from './blockChain';
import { AddressZero } from '@hooks/stake';

/**
 * encodeStake

 * @param amount
 * @returns
 */
export function encodeStake(amount) {
  const types = ['uint256'];
  const parmData = [
    amount
  ];

  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * 
 * @param {*} amount 
 * @param {*} minAmount 
 * @returns 
 */
export function encodeStaking(amount, minAmount) {
  console.log('Staking', {
    amount: amount.toString(),
    minAmount: minAmount.toString()
  })
  const types = ['uint256', 'uint256'];
  const parmData = [
    amount,
    minAmount
  ];

  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * encodeUnstakeETHx
 */
export function encodeUnstakeETHx(ethXAmount) {
  const { ethxAddress } = dappConfig
  const types = ['tuple(address, uint256)'];
  const parmData = [
    [
      ethxAddress,
      utils.parseEther(ethXAmount)
    ]
  ];

  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * encodeClaim
 */
export function encodeClaim(requestId, address) {
  const types = ['tuple(address, uint256, uint256, uint256)'];
  const parmData = [
    [
      address,
      requestId,
      '1000000000000000000',
      '1000000000000000000',
    ]
  ];
  return utils.defaultAbiCoder.encode(types, parmData);
}

/* --------------------------- convex ---------------------------- */

/**
 * encodeDeposit

 * @param amount
 * @returns
 */
export function encodeDeposit(amount, xAmount, minAmount) {
  console.log('encodeDeposit', {
    amount, xAmount, minAmount
  })
  const types = ['uint256[2]', 'uint256'];
  const parmData = [
    [utils.parseEther(amount), utils.parseEther(xAmount)],
    utils.parseEther(minAmount)
  ];

  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * encodeWithdraw
 */
export function encodeWithdraw({ lpAmount, address, minAmount }) {
  const types = ['uint256', 'uint256[2]', 'address'];
  const parmData = [
    utils.parseEther(lpAmount),
    minAmount.map(i => utils.parseEther(i || '0')),
    address
  ];
  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * encodeWithdrawOneCoin
 */
export function encodeWithdrawOneCoin({ lpAmount, i, address, minAmount }) {
  const types = ['uint256', 'int128', 'uint256', 'address'];
  const parmData = [
    utils.parseEther(lpAmount),
    i,
    utils.parseEther(minAmount || '0'),
    address
  ];
  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * encodeWithdrawETHToEOA
 */
export function encodeWithdrawETHToEOA({ lpAmount, minAmount }) {
  const types = ['uint256', 'uint256', 'uint256'];
  const parmData = [
    utils.parseEther(lpAmount),
    utils.parseEther(minAmount || '0'),
    utils.parseEther('1'),
  ];
  return utils.defaultAbiCoder.encode(types, parmData);
}

/**
 * encodeClaimConvex
 */
export function encodeClaimConvex() {
  const types = ['address', 'address'];
  const parmData = [
    convexConfig.lpAddress,
    AddressZero
  ];
  return utils.defaultAbiCoder.encode(types, parmData);
}