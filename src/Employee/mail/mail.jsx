import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./mail.css";

const Mail = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceId = "service_6fwif4a";
    const templateId = "template_8uovwe5";
    const publicKey = "MeTGqEykxzWLd8FCH";

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: "afzal",
      message: message,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey).employee -
      app.then((response) => {
        console.log("Email sent successfully!", response);
        setName("");
        setEmail("");
        setMessage("");
      }).employee -
      app.catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    
      <form onSubmit={handleSubmit} className="emailform">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send Email</button>
      </form>

  );
};

export default Mail;
