import {
  forwardRef,
  Children,
  useRef,
  cloneElement,
  useState,
} from 'react'
import { Popover } from '@lidofinance/lido-ui';
import { useMergeRefs } from '@utils/index'
import styles from "./index.module.scss";
import { isMobile } from 'react-device-detect';

const BODY_PERSISTENT_TIMEOUT = 150

const Tooltip = forwardRef(({ title, children, className = '', ...rest }, ref) => {
  const [state, setState] = useState(false)
  const keepTimeoutRef = useRef(null)

  const child = Children.only(children)

  const anchorRef = useRef(null)
  const mergedRef = useMergeRefs([child.ref, anchorRef])

  const handleMouseEnter = () => {
    if (keepTimeoutRef.current) {
      clearTimeout(keepTimeoutRef.current)
      keepTimeoutRef.current = null
    }
    setState(true)
  }

  const handleMouseLeave = () => {
    keepTimeoutRef.current = setTimeout(() => {
      setState(false)
      keepTimeoutRef.current = null
    }, BODY_PERSISTENT_TIMEOUT)
  }

  return (
    <>
      {cloneElement(child, {
        ref: mergedRef,
        onMouseEnter(event) {
          handleMouseEnter()
          child.props.onMouseEnter?.(event)
        },
        onMouseLeave(event) {
          handleMouseLeave()
          child.props.onMouseLeave?.(event)
        },
      })}
      <Popover
        {...rest}
        className={`${styles.root} ${className}`}
        open={state}
        backdrop={isMobile ? true : false}
        anchorRef={anchorRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
      >
        {title}
      </Popover>
    </>
  )
},
)
Tooltip.displayName = 'Tooltip'

export default Tooltip