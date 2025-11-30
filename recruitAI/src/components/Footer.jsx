import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center gap-4 py-3 mt-10'>

      <div className='flex flex-row gap-2 align-center justify-center'>
        <img className='h-10 w-10 object-contain' src={assets.logo_icon} alt="" />
        <h2 className='text-2xl'>
          <span className='font-bold'>Recruit</span>
          <span className='font-semibold'>AI</span></h2>
      </div>
      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @2025 All rights reserved</p>
      <div className='flex gap-2.5'>
        <img width={38} src={assets.facebook_icon} alt="" />
        <img width={38} src={assets.twitter_icon} alt="" />
        <img width={38} src={assets.instagram_icon} alt="" />
      </div>
    </div>
  )
}

export default Footer
