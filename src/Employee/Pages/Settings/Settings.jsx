import React, { useState } from 'react';
import './Settings.css';
import Settingsnav from '../Settingsnav/Settingsnav';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSave = () => {
    console.log('username:', username);
    console.log('password:', password);
    console.log('email:', email);
    console.log('profilePic:', profilePic);
  };

 const handleInputChange = (e) => {
  const { name, files } = e.target;
  console.log(name, files[0]); 
};


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
      <Settingsnav />
      <div className="container-settings">
        <div className="settings">
          <h1>Settings</h1>

    
          <div className="settings__container">
            <div className="settings__container__item">
              <h2>General Settings</h2>

              <div className="form-row">
                <label htmlFor="profilePic">Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              {previewUrl && (
                <div className="form-row">
                  <label></label>
                  <img src={previewUrl} alt="Preview" className="profile-pic-preview" />
                </div>
              )}

              <div className="form-row">
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-row">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-row">
                <label>Upload Document</label>
                <div className="document-upload">
                  <select>
                    <option>Select Document Type</option>
                    <option value="10th">10th Certificate</option>
                    <option value="12th">12th Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="marksheet">Marksheet</option>
                    <option value="provisional">Provisional Certificate</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                  <input type="file" className="file-input" />
                </div>
              </div>

              {[
                { label: 'Update Aadhar Card', name: 'aadharFile' },
                { label: 'Update PAN Card', name: 'panFile' },
                { label: 'Update Passport', name: 'passportFile' },
                { label: 'Update Driving License', name: 'drivingLicenseFile' },
                { label: 'Update Voter ID', name: 'voterIdFile' },
              ].map(({ label, name }) => (
                <div className="form-row" key={name}>
                  <label>{label}</label>
                  <input
                    type="file"
                    name={`documents.${name}`}
                    onChange={handleInputChange}
                    className="file-input"
                  />
                </div>
              ))}

              <div className="form-row">
                <label></label>
                <button className="accbtn" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings__footer__item" id="comments">
          <h2>Comments</h2>
          <textarea placeholder="comments" className="comments"></textarea>
          <button className="footer-button">Submit</button>
        </div>

      </div>
    </>
  );
};

export default Settings;
