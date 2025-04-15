import React from 'react'
import "./bounty-styles.css"

const BountyButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="bounty-button" onClick={onClick}>💰 Create Bounty</button>
  )
}

export default BountyButton