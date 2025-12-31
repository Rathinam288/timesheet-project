 import {React, useState} from 'react';
import './Div.css';

 const Div = () => {
  const[showPopup, setShowPopup] = useState(false);
  const[currentAmount, setCurrentAmount] = useState('');
  
    const openPopup = (amount) => {
    setCurrentAmount(amount);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentAmount('');
  };

  return (
    <>
    <div className="Record-dash">
      <div className="box revenue" onClick={() => openPopup("₹1,200,000")}>
          <h3>Total Revenue</h3>
          <div className="amount-wrapper">₹*****</div>
          <span className="growth">↑ +16% last month</span>
        </div>
      <div className="box profit" onClick={() => openPopup("₹250,000")}>
        <h3>Net Profit</h3>
        <div className="amount-wrapper">₹*****</div>
        <span className="growth">↑ +8% over month</span>
      </div>
      <div className="box expenses" onClick={() => openPopup("₹950,000")}>
        <h3>Expenses</h3>
        <div className="amount-wrapper">₹*****</div>
        <span className="growth">↑ +6% last month</span>
      </div>
      <div className="box cashflow" onClick={() => openPopup("₹860,000")}>
        <h3>Cash Flow</h3>
        <div className="amount-wrapper">₹*****</div>
        <span className="growth">↑ +16% last month</span>
      </div>
    </div>
    {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3>Amount</h3>
            <p>{currentAmount}</p>
            <button onClick={closePopup} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Div;