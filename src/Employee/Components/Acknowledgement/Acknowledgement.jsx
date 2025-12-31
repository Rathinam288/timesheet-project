import { useState } from 'react';
import './Acknowledgement.css'; 
import { useNavigate } from 'react-router-dom';

function Acknowledgement() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [click,setClick] = useState(false);
  const navigate = useNavigate();

  const handleAcknowledge = () => {
    if(!acknowledged){
      alert("Please Acknowledge");
    }
    
    if(acknowledged){
    setTimeout(() => {
      navigate('/employee/dashboard');
    }, 1000);
    setClick(true);
  }
  };

  const pdfPath = '/pdf/acknowledgement.pdf'; 

  return (
    <div className="leave-policy-container">
      <h2>Acknowledgement Form</h2>
      <div className="leave-policy-content">
        <ul>
          <li>✓ Each employee is entitled to 12 paid leaves annually.</li>
          <li>✓ Sick leaves require medical certificates if exceeding 2 days.</li>
          <li>✓ Leave must be approved by the reporting manager in advance.</li>
          <li>✓ Unauthorized absence for 3+ days may lead to disciplinary action.</li>
          <li>✓ Weekend and public holidays are not counted as leave unless combined with long leaves.</li>
        </ul>
      </div>
      <div className='ack-t-cont'>
      <div className="ack-container">
      <h2 className="ack-title">Leave Policy</h2>
        <div className="ack-pdf-viewer iframe-scroll-wrapper">
  <iframe
    src={pdfPath}
    title="Acknowledgement PDF"
    className="ack-pdf-iframe"
  ></iframe>
</div>

      <div className="ack-download">
        <a href={pdfPath} download className="ack-download-button">
          Download PDF
        </a>
      </div>
    </div>
    <div className="ack-container">
      <h2 className="ack-title">Employment Policy</h2>
        <div className="ack-pdf-viewer iframe-scroll-wrapper">
  <iframe
    src={pdfPath}
    title="Acknowledgement PDF"
    className="ack-pdf-iframe"
  ></iframe>
</div>

      <div className="ack-download">
        <a href={pdfPath} download className="ack-download-button">
          Download PDF
        </a>
      </div>
    </div>
    </div>
    <div className='ack-check'>
      <input type="checkbox" checked={acknowledged} onChange={(e)=>setAcknowledged(e.target.value)}/>I Acknowledge</div>
    {!click ? (
        <button onClick={handleAcknowledge} className="acknowledge-btn">
          Submit
        </button>
      ) : (
        <p className="thanks-message">✅ Thank you for acknowledging the policy!</p>
      )}
    </div>
  );
}

export default Acknowledgement;

