import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginButton.css';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login-home');
  }

  return (
    <button className='login-button' onClick={handleClick}>
      Login
    </button>
  );
};

export default LoginButton;