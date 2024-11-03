import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingButton.css';


const LandingButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/star-map');
  }

  return (
    <button className='redirect-button' onClick={handleClick}>
      Nebula Navigator
    </button>
  );
};

export default LandingButton;