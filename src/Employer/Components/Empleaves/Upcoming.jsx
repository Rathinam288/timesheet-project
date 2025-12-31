import React from "react";
import "./Upcoming.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";

function Upcoming() {
  const [data, setData] = useState([]);
  const [delalert, setdelalert] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const responsee = await axios
        .get("http://localhost:8080/api/leaves/all")
        .catch((err) => console.log(err));
      setData(responsee.data);
    };
    getData();
  }, []);

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:8080/api/leaves/delete/${id}`)
      .catch((err) => {
        console.log("error" + err);
      });
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const navigate = useNavigate();

  const handleeditClick = (id) => {
    navigate(`/Leavedetails/edit/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // ensures 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="upcom1">
      <div className="statu">
        <div id="leave-heading">
          <h2 className="sttext">Leave Record</h2>
        </div>

        {data.map((res, index) => (
          <>
            {delalert === res.id ? (
              <div id="leave-tab" className="reconfirm">
                <p>Confirm to Delete Leave Request</p>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="leave-del-but"
                  id="leave-d-b"
                >
                  Yes
                </button>
                <button
                  onClick={() => setdelalert(null)}
                  className="leave-pending-but leave-del-but"
                  id="leave-e-b"
                >
                  No
                </button>
              </div>
            ) : (
              <div
                id="leave-tab"
                className={`${
                  res.status === "Approved"
                    ? "leave-approved-tab"
                    : res.status === "Pending"
                    ? "leave-pending-tab"
                    : "leave-rejected-tab"
                }`}
              >
                <div className="leave-leave-date">
                  <h4 key={index}>{formatDate(res.from_date)}</h4>-
                  <h4>{formatDate(res.to_date)}</h4>
                </div>
                <div id="leave-reason">{res.description}</div>
                <div className="leave-but">
                  <button
                    className={`leave-del-but ${
                      res.status === "Approved"
                        ? "leave-approved"
                        : res.status === "Pending"
                        ? "leave-pending-but"
                        : ""
                    }`}
                  >
                    {res.status}
                  </button>
                  {res.status === "Pending" && (
                    <>
                      <button
                        className="leave-del-but"
                        id="leave-delete"
                        onClick={() => {
                          setdelalert(res.id);
                        }}
                      >
                        delete
                      </button>
                      <div
                        className="leave-edit"
                        id="ed"
                        onClick={() => {
                          handleeditClick(res.id);
                        }}
                      >
                        <MdModeEditOutline />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default Upcoming;
