 import React, {useState, useContext} from 'react'
import './Settings.css'
import Button from '../../Components/Button/Button'
 import { ThemeContext } from '../../Components/Theme/ThemeContext';
import Settingsnav from '../Settingsnav/Settingsnav';

 const Settings = () => {
  const[username, setUsername] = useState('')
  const[password, setPassword] = useState('')
  const[email, setEmail] = useState('')
  const[address, setAddress] = useState('')
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleAccountSave = () => {
    console.log('username:', username);
    console.log('password:', password);
    console.log('email:', email);
    console.log('profilePic:', profilePic);
};
 const handlegeneralsave=()=>{
  console.log('address:', address);
  
   }
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfilePic(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };



  return (
    <>
    <Settingsnav/>
      <div className="container-settings">
        <div className="settings">
          <h1>Settings</h1>
          <div className="settings__container">
            <div className="settings__container__item">
              <h2>General Settings</h2>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="input"
              />
              <label htmlFor="theme">Theme</label>
            
              <button className='seting-btn' onClick={toggleTheme}>
                Toggle to {theme === "light" ? "Dark" : "Light"} Mode
              </button>

              <Button text="Save" className="generalbtn seting-btn" onClick={handlegeneralsave} />
            </div>
            <div className="settings__container__item">
              <h2>Account Settings</h2>
              <label htmlFor="profilePic">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="profile-pic-preview"
                />
              )}

              <label htmlFor="username">User Name</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="Enter your username"
                className="input"
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter your email"
                className="input"
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter your password"
                className="input"
              />

              <Button text="Save" className='accbtn seting-btn' onClick={handleAccountSave} />
            </div>
          </div>
        </div>

        <div className="settings__footer__item" id='comments'>
          <h2>Comments</h2>
          <textarea placeholder="comments" className="comments"></textarea>

          <Button text="Submit" />
        </div>
        <div className="settings__footer__item">
          <h2>Delete Account</h2>
          <Button text="Delete" className="delete seting-btn" />
        </div>
      </div>
    </>
  );
}

export default Settings
