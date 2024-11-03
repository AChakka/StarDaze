import React from 'react'
import video from '../assets/ShootingNight1.mp4'
import './ShootingBackground.css'

const ShootingBackground = () => {
  return (
    <div className='shooting'>
        <video src={video} autoPlay loop muted />
    </div>
  )
}

export default ShootingBackground