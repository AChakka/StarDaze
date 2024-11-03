import React from 'react'
import{siInstagram, siX, siLinktree, siDiscord} from 'simple-icons';
import './Socials.css'

const Socials = () => {
  return (
    <div className='social'>

        <a href="https://www.instagram.com/nasa" target="_blank" className='socialContainer instagramContainer'>
            <svg className='instagramSvg' viewBox='0 0 24 24'>
                <path d={siInstagram.path}/>
            </svg>
        </a>

        <a href="https://x.com/NASA" target='_blank' className='socialContainer xContainer'>
            <svg className='xSvg' viewBox='0 0 24 24'>
                <path d={siX.path}/>
            </svg>
        </a>

        <a href="https://linktr.ee/kotharisoumil" target="_blank" className='socialContainer linkContainer'>
            <svg className='linkSvg' viewBox='0 0 24 24'>
                <path d={siLinktree.path}/>
            </svg>
        </a>

        <a href="https://discord.gg/87bgkxW8" target="_blank" className='socialContainer discordContainer'>
            <svg className='discordSvg' viewBox='0 0 24 24'>
                <path d={siDiscord.path}/>
            </svg>
        </a>

    </div>
  )
}

export default Socials