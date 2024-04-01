import React from 'react'

function Navbar() {
  return (
    <div id='navbar-div' className='bg-blue-300 py-2 px-4 flex justify-between'>
        <div id='navbar-left'>
            <h1>LOGO</h1>
        </div>
        <div id='navbar-right' className='flex gap-4'>
            <button id='login-btn' className='bg-white px-3 py-1 rounded'>Login</button>
            <button id='register-btn' className='bg-white px-3 py-1 rounded'>Sign-Up</button>
        </div>
    </div>
  )
}

export default Navbar