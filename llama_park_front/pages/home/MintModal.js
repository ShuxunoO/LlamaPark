import { Button, Modal, Input } from "@lidofinance/lido-ui";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

function MintModal({ open, onClose, onMint }) {
  const inviterAddressUrl = useSelector((state) => state.user.inviterAddress);
  const [inviterAddress, setInviterAddress] = useState(inviterAddressUrl);

  useEffect(() => {
    setInviterAddress(inviterAddressUrl);
  }, [inviterAddressUrl]);
  const handleInputChange = (e) => {
    setInviterAddress(e.target.value);
  };

  const handleMintClick = () => {
    onMint(inviterAddress);
  };

  return (
    <Modal open={open} onClose={onClose} title="Do you have a inviter address?">
      <div>
        <div className="flex items-center mb-4">
          <Input
            variant="small"
            fullwidth
            value={inviterAddress}
            onChange={handleInputChange}
            placeholder="Enter inviter address"
            label="Email address"
            rightDecorator={<Button size="xs" onClick={handleMintClick}>Mint</Button>}
            className="text-white [&_input]:text-white"
          />
        </div>
        <div className="flex justify-center">
          <button className="text-xs flex items-center" onClick={handleMintClick}>
            No inviter, just mint <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default MintModal;