import React from 'react'
import { useNavigate } from 'react-router-dom';
import './ParkButton.css'

const ParkButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/park-map');
    }

  return (
    <div className="galaxy-button">
  <button className="space-button" onClick={handleClick}>
    <span className="backdrop"></span>
    <span className="galaxy"></span>
    <label className="text">Space</label>
  </button>
  <div class="bodydrop"></div>
</div>

  )
}

export default ParkButton