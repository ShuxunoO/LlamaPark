import { forwardRef } from 'react';
import { Input as BaseInput } from '@lidofinance/lido-ui';
import styles from './index.module.scss'

const Input = forwardRef(({ symbol, max, min, onChange, onMax, loading, error, className = '', placeholder, ...resProps }, ref) => {
  const _onChange = (e) => {
    const value = e.target.value
    if (max !== undefined && value > max) {
      e.target.value = max
      return
    }
    if (min !== undefined && value < min) {
      e.target.value = min
      return
    }
    onChange(e)
  }
  return (
    <BaseInput
      ref={ref}
      title=''
      error={error}
      className={`${styles.root} ${className} ${error ? styles.error : ''}`}
      {...resProps}
      placeholder={placeholder || `${symbol} Amount`}
      onChange={_onChange}
      type={'number'}
    />
  );
})

export default Input;
