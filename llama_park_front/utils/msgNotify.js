import { ToastSuccess } from "@lidofinance/lido-ui";
import { EXPLORER_HOST_ETH, EXPLORER_HOST_POLYGON, EXPLORER_HOST_ETH_TEST } from '@config/env';
import Error from '@icons/error.svg?url'
import Right from '@icons/right.svg?url'
import Info from '@icons/info.svg?url'

function hashFilter(val) {
  if (!val) return ''
  return val.substr(0, 6) + "..." + val.substr(-3);
}

const icons = {
  success: Right.src,
  error: Error.src,
  info: Info.src,
}

export const notify = (text, type = 'success') => {
  ToastSuccess(
    <div className={'toastMain'}>
      <img className={'toastSvg'} src={icons[type]} />
      <h3 className={'toastTitle'}>{text}</h3>
    </div>,
    {
      type, // error success warning info
      position: "top-right",
      closeButton: true,
      className: 'toastIfy',
      hideProgressBar: false,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      closeOnClick: false,
      autoClose: 10000,
      delay: 0,
    }
  );
};

export const hashNotify = (hash, type = 'success', title) => {
  const host = window.localStorage.getItem("EXPLORER_HOST") || EXPLORER_HOST_ETH_TEST;
  ToastSuccess(
    <div className={'toastMain'}>
      <img className={'toastSvg'} src={type === 'success' ? Right.src : Error.src} />
      <h3 className={'toastTitle'}>{title || (type === 'success' ? 'Transaction Confirmed' : 'Transaction Failed')}</h3>
      <span className={'toastHashTip'}>
        hash:
      </span>
      <a
        href={`${host}/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
        className={'toastHash'}
      >
        {hashFilter(hash)}
      </a>
    </div>,
    {
      type, // error success warning info
      position: "top-right",
      closeButton: true,
      className: 'toastIfy',
      hideProgressBar: false,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      closeOnClick: false,
      autoClose: 10000,
      delay: 0,
    }
  );
};