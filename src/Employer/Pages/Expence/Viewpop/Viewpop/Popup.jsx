import React from "react";
 function Popup({ selectedItem, setSelectedItem, calculateGST, calculateTotal }) {
  
  return (
    <>
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Expense Details</h3>
            <div className="modal-details">
              <p><strong>Date:</strong> {selectedItem.date}</p>
              <p><strong>Type:</strong> {selectedItem.type}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
              <p><strong>Item:</strong> {selectedItem.item}</p>
              <p><strong>Client:</strong> {selectedItem.client}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Expire Date:</strong> {selectedItem.expireDate}</p>
              <p><strong>Amount:</strong> ₹{selectedItem.amount.toFixed(2)}</p>
              <p><strong>GST:</strong> ₹{calculateGST(selectedItem.amount).toFixed(2)}</p>
              <p><strong>Total:</strong> ₹{calculateTotal(selectedItem.amount).toFixed(2)}</p>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setSelectedItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Popup;
