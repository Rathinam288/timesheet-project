import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../Components/Notification/NotificationContext";
import "./Team2.css";

const API_BASE = "http://localhost:8080/api";

const Team = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [items, setItems] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewTeam, setViewTeam] = useState(null);
  const [newItem, setNewItem] = useState(emptyTeam());

  function emptyTeam() {
    return {
      id: "",
      ceo: "",
      hrManager: "",
      client: "",
      teamName: "",
      teamManager: "",
      teamLeader: "",
      teamSenior: "",
      teamMember: [],
      projectName: "",
      startDate: "",
      endDate: "",
      status: "",
    };
  }

  useEffect(() => {
    loadTeams();
    loadProjects();
    loadClients();
    loadEmployees();
  }, []);

  const loadTeams = () => {
    axios
      .get(`${API_BASE}/team`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Team fetch failed", err));
  };

  const loadProjects = () => {
    axios
      .get(`${API_BASE}/projects`)
      .then((res) => setProjectData(res.data))
      .catch((err) => console.error("Project fetch failed", err));
  };

  const loadClients = () => {
    axios
      .get(`${API_BASE}/clients`)
      .then((res) => setClientList(res.data.map((client) => client.clientName)))
      .catch((err) => console.error("Client fetch failed", err));
  };

  const loadEmployees = () => {
    axios
      .get(`${API_BASE}/employees`)
      .then((res) => setEmployeeList(res.data.map((emp) => emp.employeeName)))
      .catch((err) => console.error("Employee fetch failed", err));
  };

  const handleModalChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectSelect = (projectName) => {
    const project = projectData.find((p) => p.projectName === projectName);
    if (project) {
      setNewItem((prev) => ({
        ...prev,
        projectName: project.projectName,
        client: project.client || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        teamMember: project.assignees || [],
      }));
    } else {
      handleModalChange("projectName", projectName);
    }
  };

  const addMember = (member) => {
    if (member && !newItem.teamMember.includes(member)) {
      setNewItem((prev) => ({
        ...prev,
        teamMember: [...prev.teamMember, member],
      }));
    }
  };

  const removeMember = (member) => {
    setNewItem((prev) => ({
      ...prev,
      teamMember: prev.teamMember.filter((m) => m !== member),
    }));
  };

  const addNewItem = () => {
    const {
      id,
      ceo,
      hrManager,
      client,
      teamName,
      teamManager,
      teamLeader,
      teamSenior,
      teamMember,
      projectName,
      startDate,
      endDate,
      status,
    } = newItem;

    if (
      !id ||
      !ceo ||
      !hrManager ||
      !client ||
      !teamName ||
      !teamManager ||
      !teamLeader ||
      !teamSenior ||
      teamMember.length === 0 ||
      !projectName ||
      !startDate ||
      !endDate ||
      !status
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const saveReq = isEditing
      ? axios.put(`${API_BASE}/team/${id}`, newItem)
      : axios.post(`${API_BASE}/team`, newItem);

    saveReq
      .then(() => {
        loadTeams();
        setModalOpen(false);
        setIsEditing(false);
        setNewItem(emptyTeam());

        if (!isEditing) {
          addNotification(
            "New Team Created",
            `Team '${teamName}' assigned to '${projectName}'.`,
            id,
            client,
            projectName
          );
        }
      })
      .catch((err) => {
        console.error("Save failed", err);
        alert("Failed to save team.");
      });
  };

  const handleEdit = (index) => {
    setNewItem(items[index]);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this team?")) {
      axios
        .delete(`${API_BASE}/team/${id}`)
        .then(() => loadTeams())
        .catch((err) => {
          console.error("Delete failed", err);
          alert("Failed to delete.");
        });
    }
  };

  //  DOUBLE CLICK TO NAVIGATE TO TEAM HIERARCHY
  const handleCardDoubleClick = (item) => {
    navigate(`/employer/team/${item.id}`, { state: { team: item } });
  };

  return (
    <div className="kteam-container">
      <h2>Team Management</h2>

      <div className="card-view">
        {items.map((item, index) => (
          <div
            key={index}
            className="team-card"
            onDoubleClick={() => handleCardDoubleClick(item)}
          >
            <h4>Team: {item.teamName}</h4>
            <p>
              <strong>Client:</strong> {item.client}
            </p>
            <p>
              <strong>Project:</strong> {item.projectName}
            </p>
            <p>
              <strong>Status:</strong> {item.status}
            </p>
            <p>
              <strong>CEO:</strong> {item.ceo}
            </p>
            <p>
              <strong>HR:</strong> {item.hrManager}
            </p>
            <p>
              <strong>Manager:</strong> {item.teamManager}
            </p>
            <p>
              <strong>Leader:</strong> {item.teamLeader}
            </p>
            <p>
              <strong>Senior:</strong> {item.teamSenior}
            </p>
            <p>
              <strong>Start:</strong> {item.startDate}
            </p>
            <p>
              <strong>End:</strong> {item.endDate}
            </p>
            <p>
              <strong>Members:</strong> {(item.teamMember || []).join(", ")}
            </p>
            <button onClick={() => setViewTeam(item)}>View</button>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>

      <button
        className="add-team"
        onClick={() => {
          setNewItem(emptyTeam());
          setModalOpen(true);
          setIsEditing(false);
        }}
      >
        Add Team
      </button>

      {isModalOpen && (
        <div className="team-overlay">
          <div className="kteam">
            <h3>{isEditing ? "Edit Team" : "Add Team"}</h3>
            <div className="kteam-form">
              {[
                "id",
                "ceo",
                "hrManager",
                "teamName",
                "teamManager",
                "teamLeader",
                "teamSenior",
              ].map((field) => (
                <label key={field}>
                  {field.toUpperCase()}
                  <input
                    type="text"
                    value={newItem[field]}
                    onChange={(e) => handleModalChange(field, e.target.value)}
                  />
                </label>
              ))}

              <label>
                CLIENT
                <select
                  value={newItem.client}
                  onChange={(e) => handleModalChange("client", e.target.value)}
                >
                  <option value="">Select Client</option>
                  {clientList.map((client, idx) => (
                    <option key={idx} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                PROJECT
                <select
                  value={newItem.projectName}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projectData.map((project) => (
                    <option
                      key={project.projectName}
                      value={project.projectName}
                    >
                      {project.taskList}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                START DATE
                <input
                  type="date"
                  value={newItem.startDate}
                  onChange={(e) =>
                    handleModalChange("startDate", e.target.value)
                  }
                />
              </label>
              <label>
                END DATE
                <input
                  type="date"
                  value={newItem.endDate}
                  onChange={(e) => handleModalChange("endDate", e.target.value)}
                />
              </label>

              <label>
                TEAM MEMBERS
                <select onChange={(e) => addMember(e.target.value)}>
                  <option value="">Select Employee</option>
                  {employeeList.map((emp, i) => (
                    <option key={i} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </label>

              <ul className="member-list">
                {newItem.teamMember.map((m, i) => (
                  <li key={i}>
                    {m} <button onClick={() => removeMember(m)}>×</button>
                  </li>
                ))}
              </ul>

              <label>
                STATUS
                <select
                  value={newItem.status}
                  onChange={(e) => handleModalChange("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Yet to Start">Yet to Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>

              <div className="button-group">
                <button onClick={addNewItem} className="employer-add-btn">
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setNewItem(emptyTeam());
                    setIsEditing(false);
                  }}
                  className="employer-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewTeam && (
        <div className="kteam-popup">
          <div className="popup-content">
            <h3>Team Details: {viewTeam.teamName}</h3>
            <p>
              <strong>Client:</strong> {viewTeam.client}
            </p>
            <p>
              <strong>Project:</strong> {viewTeam.projectName}
            </p>
            <p>
              <strong>Status:</strong> {viewTeam.status}
            </p>
            <p>
              <strong>CEO:</strong> {viewTeam.ceo}
            </p>
            <p>
              <strong>HR:</strong> {viewTeam.hrManager}
            </p>
            <p>
              <strong>Manager:</strong> {viewTeam.teamManager}
            </p>
            <p>
              <strong>Leader:</strong> {viewTeam.teamLeader}
            </p>
            <p>
              <strong>Senior:</strong> {viewTeam.teamSenior}
            </p>
            <p>
              <strong>Members:</strong> {(viewTeam.teamMember || []).join(", ")}
            </p>
            <button onClick={() => setViewTeam(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
