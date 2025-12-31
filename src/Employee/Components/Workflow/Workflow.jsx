import React from 'react'
import { FaFolder } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import { LiaUsersSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';

const Workflow = () => {
  const navigate = useNavigate();
  return (
    <div className="workflow">
        <button onClick={()=>navigate('/employee/jira')} className="allproject">
          <div className="fileicon" id='as1'>
            <FaFolder />
          </div>
          <div className="filedeatile">
            <h3 className='numbersofwk'>12</h3>
            <p>Active Jira Issues</p>
          </div>
        </button>
        <div className="allproject">
          <div className="fileicon" id='as2'>
            <LiaUsersSolid />
          </div>
          <div className="filedeatile">
            <h3 className='numbersofwk'>28</h3>
            <p>Active Status</p>
          </div>
        </div>
        <div className="allproject">
          <div className="fileicon" id='as3'>
          <FaFileInvoice />
          </div>
          <div className="filedeatile">
            <h3 className='numbersofwk'>5</h3>
            <p>Ongoing Task</p>
          </div>
        </div>
        <div className="allproject">
          <div className="fileicon" id='as4'>
            <BiTask />
          </div>
          <div className="filedeatile">
            <h3 className='numbersofwk'>46</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>
  )
}

export default Workflow
