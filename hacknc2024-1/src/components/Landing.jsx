import React from 'react'
import './Landing.css'
import VideoBackground from './VideoBackground'
import Typewriter from 'typewriter-effect';
import LandingButton from './LandingButton';
import Socials from './Socials';

const Landing = () => {
  return (
    <div className='wrapper'>
      <div className='title-container'>
        <h1 className='title'>
          Hello <span className='glow'>Star</span>gazers!
        </h1>
        <div className='typewriter'>
          <Typewriter
            options={{
              strings: ['Get Ready to Explore', 'Find your place in the Universe'],
              autoStart: true,
              loop: true,
              delay: 60,
              deleteSpeed: 50
            }}
          />
        </div>
        <Socials />
        <LandingButton />
      </div>
      <VideoBackground /> 
    </div>
  );
}

export default Landing; 