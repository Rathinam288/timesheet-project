import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css";
import { useNotification } from "../../Components/Notification/NotificationContext";

const Form = ({ clientId, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientCountry: "",
    clientPosition: "",
    clientCompanyName: "",
    clientCompanyAddress: "",
    projectEstimateAmount: "",
    clientCompanyPhone: "",
    clientCompanyEmail: "",
    projectName: "",
    projectCount: "",
    projectDescription: "",
    status: "",
    startDate: "",
    duaration: "",
    clientImage: "",
    companyLogo: "",
  });

  useEffect(() => {
    if (clientId) {
      axios
        .get(`http://localhost:8080/api/clients/${clientId}`)
        .then((res) => setFormData(res.data))
        .catch((err) =>
          console.error("Failed to fetch client data for edit:", err)
        );
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (clientId) {
        // Update existing client
        const res = await axios.put(
          `http://localhost:8080/api/clients/${clientId}`,
          formData
        );
        alert("Client updated successfully!");
        if (onUpdate) onUpdate(res.data);
      } else {
        if (
          formData &&
          formData.clientId &&
          formData.clientName &&
          !formData.projectId
        ) {
          addNotification(
            "New Client Added",
            "New client onboarded.",
            formData.clientId,
            formData.clientName,
            null
          );
        }
        alert("Client added successfully!");
        navigate("/employer/dashboard", { state: { refresh: true } });
      }
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Failed to save client.");
    }
  };

  return (
    <form className="clientcompanydetails-form" onSubmit={handleSubmit}>
      <h2>{clientId ? "Edit Client" : "Add New Client"}</h2>

      <label>Client ID</label>
      <input
        type="text"
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        required
        disabled={!!clientId}
      />

      <label>Client Name</label>
      <input
        type="text"
        name="clientName"
        value={formData.clientName}
        onChange={handleChange}
        required
      />

      <label>Client Phone</label>
      <input
        type="text"
        name="clientPhone"
        value={formData.clientPhone}
        onChange={handleChange}
        required
      />

      <label>Client Email</label>
      <input
        type="email"
        name="clientEmail"
        value={formData.clientEmail}
        onChange={handleChange}
        required
      />

      <label>Client Position</label>
      <input
        type="text"
        name="clientPosition"
        value={formData.clientPosition}
        onChange={handleChange}
        required
      />

      <label>Company Name</label>
      <input
        type="text"
        name="clientCompanyName"
        value={formData.clientCompanyName}
        onChange={handleChange}
        required
      />

      <label>Company Address</label>
      <input
        type="text"
        name="clientCompanyAddress"
        value={formData.clientCompanyAddress}
        onChange={handleChange}
        required
      />

      <label>Company Phone</label>
      <input
        type="text"
        name="clientCompanyPhone"
        value={formData.clientCompanyPhone}
        onChange={handleChange}
        required
      />

      <label>Company Email</label>
      <input
        type="email"
        name="clientCompanyEmail"
        value={formData.clientCompanyEmail}
        onChange={handleChange}
        required
      />

      <label>Project Name</label>
      <input
        type="text"
        name="projectName"
        value={formData.projectName}
        onChange={handleChange}
        required
      />

      <label>Client Country</label>
      <input
        type="text"
        name="clientCountry"
        value={formData.clientCountry}
        onChange={handleChange}
        required
      />

      <label>Project Count</label>
      <input
        type="text"
        name="projectCount"
        value={formData.projectCount}
        onChange={handleChange}
        required
      />

      <label>Project Description</label>
      <input
        type="text"
        name="projectDescription"
        value={formData.projectDescription}
        onChange={handleChange}
        required
      />

      <label>Project Estimate Amount</label>
      <input
        type="text"
        name="projectEstimateAmount"
        value={formData.projectEstimateAmount}
        onChange={handleChange}
        required
      />

      <label>Status</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Status --</option>
        <option value="Completed">Completed</option>
        <option value="Not started">Not started</option>
        <option value="Pending">Pending</option>
      </select>

      <label>Start Date</label>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
      />

      <label>Duration</label>
      <input
        type="text"
        name="duaration"
        value={formData.duaration}
        onChange={handleChange}
        required
      />

      <label>Client Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "clientImage")}
      />
      {formData.clientImage && (
        <img src={formData.clientImage} alt="Preview" width="100" />
      )}

      <label>Company Logo</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "companyLogo")}
      />
      {formData.companyLogo && (
        <img src={formData.companyLogo} alt="Preview" width="100" />
      )}

      <div className="clientcompanydetails-form-buttons">
        <button type="submit" className="clientcompanydetails-submit-btn">
          {clientId ? "Update Client" : "Add Client"}
        </button>
        <button
          type="button"
          className="clientcompanydetails-cancel-btn"
          onClick={() => onClose && onClose()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Form;
