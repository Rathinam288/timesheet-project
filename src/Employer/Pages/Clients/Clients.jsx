 import React from "react";
import "../Clients/Clients.css";
import ClientDetails from '../../Components/ClientDetails/ClientDeatils';

 const Clients = () => {

  return (
    <div>
      <div className="overall-client">
        <div>
          <ClientDetails />
        </div>
      </div>
    </div>
  );
};

export default Clients;
