import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Company.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Company() {
  const [clients, setClients] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/clients")
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error fetching clients:", err));
  }, []);

  const visibleClients = clients.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (startIndex + itemsPerPage < clients.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <div className="heading">
      <h1>Clients / Companies</h1>

      <div className="company-navigation-wrapper">
        <button
          className="nav-arrow left"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          <FaArrowLeft />
        </button>

        <div className="company-grid">
          {visibleClients.map((client) => (
            <div
              key={client.clientId}
              className="company-card"
              onClick={() => navigate(`/employer/client/${client.clientId}`)}
            >
              <img src={client.companyLogo} alt={client.clientCompanyName} />
              <h4>{client.clientCompanyName}</h4>
            </div>
          ))}
        </div>

        <button
          className="nav-arrow right"
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= clients.length}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
