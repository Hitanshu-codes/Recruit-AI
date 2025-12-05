import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()
  const { setShowRecruiterLogin } = useContext(AppContext)
  return (
    <div className='shadow py-4'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
        {/* Left group (logo + site title) */}
        <div onClick={() => navigate("/")} className='flex items-center gap-3 cursor-pointer'>
          <img src={assets.logo_icon} alt="RecruitAI logo" className='h-10 w-10 object-contain' />
          <h1 className='text-3xl'>
            <span className='font-bold'>Recruit</span>
            <span className='font-semibold'>AI</span>
          </h1>
        </div>
        {
          user ?
            <div className='flex items-center gap-4'>
              <Link to="/applications"><button className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full max-sm:text-xs p-1'>Applied Job</button></Link>
              <p className='max-sm:hidden'>Hi, {user.firstName + " " + user.lastName + ""}</p>
              <UserButton />
            </div> :
            <div className='flex gap-4 max-sm:text-xs'>
              <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
              <button onClick={e => openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
        }

      </div>
    </div >
  )
}

export default Navbar
