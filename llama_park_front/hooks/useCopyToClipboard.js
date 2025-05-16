import { useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { notify } from '@utils/msgNotify';

export const useCopyToClipboard = (text) => {
  return useCallback(() => {
    copy(text);
    notify('Copy Success');
  }, [text]);
};
