import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClientDetails.css";
import Form from "../Form/Form";

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch clients when component mounts or clientId changes
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/clients")
      .then((res) => {
        setClients(res.data);
        const index = res.data.findIndex(
          (client) => client.clientId.toString() === clientId
        );
        setActiveIndex(index >= 0 ? index : 0);
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
        setError("Failed to fetch clients");
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  // Auto-slide between clients every 3 seconds
  useEffect(() => {
    if (clients.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % clients.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [clients]);

  const activeClient = clients[activeIndex];

  return (
    <div className="clientBox">
      {/* ✅ Always show Add Client button */}
      <button
        className="clientcompanydetails-add-btn"
        onClick={() => setShowAddModal(true)}
      >
        Add Client
      </button>

      {/* ✅ Conditional UI rendering */}
      {loading ? (
        <p className="loadingText">Loading Clients...</p>
      ) : error ? (
        <p className="loadingText">{error}</p>
      ) : clients.length === 0 ? (
        <p className="loadingText">No Clients Available</p>
      ) : (
        <div className="client-wrapper">
          <h2 className="title">Meet Our Clients</h2>

          {/* ✅ Client thumbnails */}
          <div className="client-thumbnails">
            {clients.map((client, index) => (
              <img
                key={client.clientId}
                src={client.clientImage}
                alt={client.clientName}
                className={`thumb ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* ✅ Main client details */}
          <div className="client-main">
            <div className="client-info">
              <h3>{activeClient.clientName}</h3>
              <p className="subtitle">
                Position: {activeClient.clientPosition}
              </p>
              <p className="subtitle">Country: {activeClient.clientCountry}</p>
              <div className="tags">
                <span>Technology</span>
                <span>Legal</span>
                <span>Consulting</span>
              </div>
              <p className="bio">
                {activeClient.projectDescription || "No description provided."}
              </p>
              <div className="actions">
                <button
                  className="view"
                  onClick={() =>
                    navigate(
                      `/employer/client/${activeClient.clientId}/details`
                    )
                  }
                >
                  View Profile
                </button>
              </div>
            </div>

            <div className="client-photo">
              <img
                src={activeClient.clientImage}
                alt={activeClient.clientName}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add Client Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Form
              onClose={() => setShowAddModal(false)}
              onClientAdded={(newClient) => {
                setClients((prev) => {
                  const updated = [...prev, newClient];
                  setActiveIndex(updated.length - 1);
                  return updated;
                });
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
