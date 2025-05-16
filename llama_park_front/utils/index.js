

import {
  EXPLORER_HOST_SCROLL,
  EXPLORER_HOST_BLAST,
  EXPLORER_HOST_ETH,
  EXPLORER_HOST_ETH_TEST,
  EXPLORER_HOST_POLYGON,
} from "@config/env";
import { BLAST_TYPE, HOST_DATA, SCROLL_TYPE, ETH_TYPE, POLYGON_TYPE, ETH_TEST_TYPE } from '@config/chains'
import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
import { useMergeRefs as useCallbackMergeRefs } from 'use-callback-ref'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const HashZero = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const useMergeRefs = (refs) => {
  return useCallbackMergeRefs(
    refs.filter((ref) => !!ref),
  )
}
const expDay = 1

export function getExpTime() {
  return Math.floor((Date.now() + 1000 * 60 * 60 * 24 * expDay) / 1000)
}

// format number to K M G, etc 
export const abbreviateNumber = (number) => {
  const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
  // what tier? (determines SI symbol)
  let tier = Math.log10(Math.abs(number)) / 3 | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return number;

  // get suffix and determine scale
  let suffix = SI_SYMBOL[tier];
  let scale = Math.pow(10, tier * 3);

  // scale the number
  let scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return 'now'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + 'm'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + 'h'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    const [, month, day] = d.toDateString().split(' ')
    return `${month} ${+day}`
  }
}

export function addressShortened(address, prevLen = 6, nextLen = 6) {
  if (!address) return ''
  return `${address.slice(0, prevLen)}...${address.slice(-nextLen)}`
}

export function formatToken(val, len = 6) {
  if (!val || val === '0') return '0'
  return new BigNumber(val).toFixed(len, 1)
}

export function formattedDate(date) {
  const _date = date * 1000
  var today = new Date(_date);
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return `${year}-${month}-${day} ${today.toLocaleTimeString()}`;
}
export function getHostByNet(selectedNetwork) {
  if (selectedNetwork === BLAST_TYPE) {
    return EXPLORER_HOST_BLAST;
  } else if (selectedNetwork === SCROLL_TYPE) {
    return EXPLORER_HOST_SCROLL;
  } else if (selectedNetwork === ETH_TYPE) {
    return EXPLORER_HOST_ETH;
  } else if (selectedNetwork === POLYGON_TYPE) {
    return EXPLORER_HOST_POLYGON;
  } else if (selectedNetwork === ETH_TEST_TYPE) {
    return EXPLORER_HOST_ETH_TEST;
  }
}
export function getHostByChain(chainId) {
  return HOST_DATA[chainId];
}
export function goExplorer(address, chainId) {
  const host = getHostByChain(chainId).host;
  window.open(`${host}/address/${address}`);
}

export function strToUtf8(str) {
  return str.replace(/[^\u0000-\u00FF]/g, function ($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
}

export function utf8ToStr(str = '') {
  return unescape(str?.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
}

export function removeTrailingZeros(val) {
  let str = String(val);
  if (str == 0) return '0.0'
  if (str.includes('.')) {
    str = str.replace(/(\.[0-9]*[1-9])0+$/, '$1');
  }
  return str;
}

export function toPlainString(str) {
  if (str.includes('e') || str.includes('E')) {
    let [coefficient, exponent] = str.split(/[eE]/);
    let power = parseInt(exponent);
    return new BigNumber(coefficient).times(BigNumber(10).pow(power));
    return (parseFloat(coefficient) * Math.pow(10, power)).toFixed(Math.abs(power));
  }
  return str;
}