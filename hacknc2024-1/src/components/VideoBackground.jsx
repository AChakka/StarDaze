import React from 'react'
import video from '../assets/StarryNight4.mp4'
import './VideoBackground.css'

const VideoBackground = () => {
  return (
    <div className='video'>
        <video src={video} autoPlay loop muted />
    </div>
  )
}

export default VideoBackground