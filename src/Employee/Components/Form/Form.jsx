import React, { useState } from "react";
import "../Form/Form.css";
import { client } from "../overallclient/Overallclient";
import { useNavigate } from "react-router-dom";

const ClientManager = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState(client);
  const [formData, setFormData] = useState({
    client_name: "",
    position: "",
    office_name: "",
    client_feedback: "",
    client_img: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setClients((prev) => [...prev, formData]);
    client.push(formData);
    alert("One New Client Add...");
    navigate("/client");

    setFormData({
      client_name: "",
      position: "",
      office_name: "",
      client_feedback: "",
      client_img: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const imageURL = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, client_img: imageURL }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="client-manager">
      <form className="client-form" onSubmit={handleSubmit}>
        <h2>Add New Client</h2>
        <label>Client Name:</label>
        <input
          type="text"
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          required
        />

        <label>Position:</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />

        <label>Office Name:</label>
        <input
          type="text"
          name="office_name"
          value={formData.office_name}
          onChange={handleChange}
          required
        />
        <label>Client Img:</label>
        <input
          type="file"
          name="client_img"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <label>Feedback:</label>
        <textarea
          name="client_feedback"
          value={formData.client_feedback}
          onChange={handleChange}
        />
        <div className="formbtn">
          <button type="submit" className="submit-btn">
            Add Client
          </button>
          <button className="submit-btn1" onClick={() => navigate("/client")}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientManager;
