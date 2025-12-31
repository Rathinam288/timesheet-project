import React, { createContext, useContext, useEffect, useState } from "react";

const ClientContext = createContext();
export const useClientContext = () => useContext(ClientContext);
export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData) => {
    const newClient = {
      clientId: parseInt(clientData.clientId),
      name: clientData.clientName,
      photo: clientData.clientImg,
      position: clientData.clientPosition || "",
      description: clientData.clientProjectDiscription,
      phone: clientData.clientPhone,
      email: clientData.clientEmail,
      country: clientData.clientCountry,
      projectName: clientData.clientProjectName,
      projectStatus: clientData.clientProjectStatus,
      officeName: clientData.clientCompanyName,
      officeAddress: clientData.clientCompanyAddress,
      officeLogo: clientData.companyImg,
      companyPhone: clientData.clientCompanyPhone,
      companyEmail: clientData.clientCompanyEmail,
      clientImage: clientData.clientImg,
    };
    setClients((prev) => [...prev, newClient]);
  };

  return (
    <ClientContext.Provider value={{ clients, addClient }}>
      {children}
    </ClientContext.Provider>
  );
};