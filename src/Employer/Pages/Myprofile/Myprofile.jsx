import React from 'react'
 import { useNavigate } from 'react-router-dom';
import './Myprofile.css'
import Settingsnav from '../Settingsnav/Settingsnav';
import img from '../../assets/client1.jpg'
import Button from '../../Components/Button/Button';
 function Myprofile() {
    const navigate = useNavigate()
    const user = {
        Name: "Kavya",
        Age: 28,
        Email: "kavya@gmail.com",
        Location: "Chennai, India",
        Phone: "123-456-7890",
        Occupation: "Software Engineer"
      };
  return (
    <>
    <Settingsnav/>
    
    <div className="profile-container">
      <h2>User Profile Details</h2>
      <img src={img} className="myprofileimg" alt=""/>
      <ul className="profile-list">
        {Object.entries(user).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
      <Button text='Edit' className='editbtn' onClick={()=>navigate('/settingProfile')} />
         </div>
    </>
  )
}

export default Myprofile