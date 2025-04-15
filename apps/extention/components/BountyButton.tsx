import { useBounty } from '../context/BountyContext';
import './BountyButton.css';

function BountyButton() {
  const { openPopup } = useBounty();

  return (
    <button 
      className="btn btn-sm bounty-button"
      onClick={openPopup}
    >
      Add Bounty
    </button>
  );
}

export default BountyButton;