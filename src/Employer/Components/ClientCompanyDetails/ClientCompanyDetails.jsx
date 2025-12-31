import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ClientCompanyDetails.css";
import Form from "../Form/Form";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaProjectDiagram,
  FaMoneyBill,
  FaCalendarAlt,
  FaHourglassHalf,
  FaClipboardCheck,
} from "react-icons/fa";

import ClientContact from "../ClientContact/ClientContact";

const ClientCompanyDetails = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/clients/${clientId}`
        );
        setClient(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch client details:", error);
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/clients/${clientId}`);
        alert("Client deleted successfully.");
        navigate("/employer/clients"); // Adjust as needed
      } catch (error) {
        console.error("Failed to delete client:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!client) return <p>No client data found.</p>;

  return (
    <div className="clientcompanydetails-container">
      <div className="clientcompanydetails-top">
        <h2 className="clientcompanydetails-title">
          {client.clientName}'s Full Profile
        </h2>
        <img
          src={client.companyLogo}
          className="clientcompanydetails-logo"
          alt="Company Logo"
        />
      </div>

      <div className="clientcompanydetails-grid">
        <div className="clientcompanydetails-card">
          <FaUser /> <span>{client.clientName}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaEnvelope /> <span>{client.clientEmail}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaPhone /> <span>{client.clientPhone}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaGlobe /> <span>{client.clientCountry}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaBriefcase /> <span>{client.clientPosition}</span>
        </div>

        <div className="clientcompanydetails-card">
          <FaBuilding /> <span>{client.clientCompanyName}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaMapMarkerAlt /> <span>{client.clientCompanyAddress}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaPhone /> <span>{client.clientCompanyPhone}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaEnvelope /> <span>{client.clientCompanyEmail}</span>
        </div>

        <div className="clientcompanydetails-card">
          <FaProjectDiagram /> <span>{client.projectName}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaClipboardCheck /> <span>{client.projectDescription}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaClipboardCheck /> <span>Count: {client.projectCount}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaMoneyBill /> <span>{client.projectEstimateAmount}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaCalendarAlt /> <span>{client.startDate}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaHourglassHalf /> <span>{client.duaration}</span>
        </div>
        <div className="clientcompanydetails-card">
          <FaClipboardCheck /> <span>Status: {client.status}</span>
        </div>
      </div>

      <div className="clientcompanydetails-footer">
        <img
          src={client.clientImage}
          className="clientcompanydetails-avatar"
          alt="Client"
        />
      </div>

      <div className="clientcompanydetails-buttons">
        <button
          className="clientcompanydetails-contact-btn"
          onClick={() => setShowContactModal(true)}
        >
          Contact Now
        </button>

        <button
          className="clientcompanydetails-edit-btn"
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </button>

        <button
          className="clientcompanydetails-delete-btn"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {showContactModal && (
        <ClientContact
          client={client}
          onClose={() => setShowContactModal(false)}
        />
      )}
      {showEditModal && (
        <div className="clientcompanydetails-modal-overlay">
          <div className="clientcompanydetails-modal-content">
            <button
              className="clientcompanydetails-close-btn"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <Form
              clientId={clientId}
              onClose={() => setShowEditModal(false)}
              onUpdate={(updatedClient) => setClient(updatedClient)}
            />
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="clientcompanydetails-modal-overlay">
          <div className="clientcompanydetails-modal-content">
            <button
              className="clientcompanydetails-close-btn"
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            <Form onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCompanyDetails;
