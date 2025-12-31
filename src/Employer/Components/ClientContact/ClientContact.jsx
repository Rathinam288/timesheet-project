import React from "react";
import "./ClientContact.css";
 import { FaEnvelope, FaPhone, FaTimes } from "react-icons/fa";

 export default function ClientContact({ client, onClose }) {
  return (
    <div className="clientContact-modal-overlay">
      <div className="clientContact-modal-content">
        <button className="clientContact-close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>{client.clientName}'s Contact</h2>

        <p>
          <FaEnvelope className="clientContact-icon" />
          <strong>Client Email:</strong> {client.clientEmail}
        </p>

        <p>
          <FaPhone className="clientContact-icon" />
          <strong>Client Phone:</strong> {client.clientPhone}
        </p>

        <p>
          <FaPhone className="clientContact-icon" />
          <strong>Company Phone:</strong> {client.clientCompanyPhone}
        </p>

        <p>
          <FaEnvelope className="clientContact-icon" />
          <strong>Company Email:</strong> {client.clientCompanyEmail}
        </p>
      </div>
    </div>
  );
}
