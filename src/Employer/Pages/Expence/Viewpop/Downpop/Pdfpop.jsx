import React from "react";
import jsPDF from "jspdf";

 function Pdfpop({ selectedItem, setSelectedItem, calculateGST, calculateTotal }) {

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);

    
    doc.text("Expense Details", 10, 10);
    doc.setFontSize(12);

    const details = [
      `Date: ${selectedItem.date}`,
      `Type: ${selectedItem.type}`,
      `Description: ${selectedItem.description}`,
      `Quantity: ${selectedItem.quantity}`,
      `Item: ${selectedItem.item}`,
      `Client: ${selectedItem.client}`,
      `Status: ${selectedItem.status}`,
      `Expire Date: ${selectedItem.expireDate}`,
      `Amount: ₹${selectedItem.amount.toFixed(2)}`,
      `GST: ₹${calculateGST(selectedItem.amount).toFixed(2)}`,
      `Total: ₹${calculateTotal(selectedItem.amount).toFixed(2)}`
    ];

    let y = 20;
    details.forEach((line) => {
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("expense-details.pdf");
  };

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
              <button onClick={downloadPDF}>Download PDF</button>
              <button onClick={() => setSelectedItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pdfpop;
