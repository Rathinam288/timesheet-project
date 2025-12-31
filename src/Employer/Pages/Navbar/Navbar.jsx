import React from 'react'
import '../Navbar/Navbar.css'
import Search from '../../Components/Search/Search'

 const Navbar = ({ notificationCount, clearNotification }) => {
  return (
    <div className='navbar'>
      <div >
        <Search  notificationCount={notificationCount}
          clearNotification={clearNotification}/>
      </div>
    </div>
  )
}

export default Navbar