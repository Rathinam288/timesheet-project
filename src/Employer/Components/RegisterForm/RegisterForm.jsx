import React from "react";
import "../RegisterForm/RegisterForm.css";
import Button from "../Button/Button";

 const RegisterForm = () => {
  return (
    <div className="register">
      <div className="container">
        <div className="forms">
          <div className="title">
            <h2>Register Form</h2>
          </div>
          <form action="" className="form">
            <label htmlFor="fname">FirstName :</label> <br />
            <input type="text" id="fname" placeholder="FirstName" /> <br />
            <label htmlFor="name">D/O/B :</label> <br />
            <input type="date" placeholder="06/02/1995" /> <br />
            <label htmlFor="name">Email :</label> <br />
            <input type="text" placeholder="abc@gmail.com" /> <br />
            <label htmlFor="name">Phone :</label> <br />
            <input type="tel" placeholder="+91 7354765875" /> <br />
            <Button />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
