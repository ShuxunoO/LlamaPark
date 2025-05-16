
import Matic from '@icons/matic.svg'
import Usdt from '@icons/usdt.svg'
import { AddressZero } from '@utils/index'

export default [
  {
    name: 'Matic',
    address: AddressZero,
    symbol: 'MATIC',
    decimals: 18,
    chainId: 137,
    chainName: 'POLYGON',
    icon: <Matic />
  },
  {
    name: 'Tether USD',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    symbol: 'USDT',
    decimals: 6,
    chainId: 137,
    chainName: 'POLYGON',
    icon: <Usdt />
  }
]