import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./Projects.css";

const Projects = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [clientList, setClientList] = useState([]);

  const [formData, setFormData] = useState({
    projectId: "",
    task: "",
    assign: [],
    clientId: "",
    clientName: "",
    start: "",
    finish: "",
    status: "",
  });

  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/projects")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch projects", err));

    axios
      .get("http://localhost:8080/api/clients")
      .then((res) => {
        const uniqueClients = [...new Set(res.data.map((c) => c.clientName))];
        setClientList(uniqueClients);
      })
      .catch((err) => console.error("Failed to fetch clients", err));

    axios
      .get("http://localhost:8080/api/employees")
      .then((res) => {
        const options = res.data.map((emp) => ({
          value: emp.empId,
          label: emp.employeeName,
        }));
        setEmployeeOptions(options);
      })
      .catch((err) => console.error("Failed to fetch employees", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAssignChange = (selected) => {
    setFormData((prev) => ({ ...prev, assign: selected || [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedEmployees = formData.assign.map((emp) => emp.value);
    const payload = {
      projectId: formData.projectId,
      taskList: formData.task,
      assigned: assignedEmployees,
      clientId: formData.clientId,
      clientName: formData.clientName,
      startDate: formData.start,
      endDate: formData.finish,
      status: formData.status,
    };
    const request = isEditing
      ? axios.put(`http://localhost:8080/api/projects/${editId}`, payload)
      : axios.post("http://localhost:8080/api/projects", payload);

    request
      .then((res) => {
        const updatedData = isEditing
          ? data.map((d) => (d.projectId === editId ? res.data : d))
          : [...data, res.data];
        setData(updatedData);
        resetForm();
      })
      .catch((err) => console.error("Failed to save project", err));
  };

  const resetForm = () => {
    setFormData({
      projectId: "",
      task: "",
      assign: [],
      clientId: "",
      clientName: "",
      start: "",
      finish: "",
      status: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleEditProject = (project) => {
    setFormData({
      projectId: project.projectId,
      task: project.taskList,
      assign: employeeOptions.filter((emp) =>
        project.assigned.includes(emp.value)
      ),
      clientId: project.clientId,
      clientName: project.clientName,
      start: project.startDate,
      finish: project.endDate,
      status: project.status,
    });
    setIsEditing(true);
    setEditId(project.projectId);
    setShowForm(true);
  };

  const handleDeleteProject = (id) => {
    axios
      .delete(`http://localhost:8080/api/projects/${id}`)
      .then(() => setData(data.filter((item) => item.projectId !== id)))
      .catch((err) => console.error("Failed to delete project", err));
  };

  return (
    <div className="employer-app">
      <div className="project-container">
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Project
        </button>

        {showForm && (
          <div className="popup-overlay">
            <form className="popup-form" onSubmit={handleSubmit}>
              <h2>{isEditing ? "Edit Project" : "Add New Project"}</h2>

              <input
                name="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="Project Name"
                required
              />
              <input
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="Project ID"
                required
              />
              <input
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                placeholder="Client ID"
                required
              />
              <select
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              >
                <option value="">Select Client</option>
                {clientList.map((name, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <label>Assign Employees</label>
              <Select
                options={employeeOptions}
                isMulti
                value={formData.assign}
                onChange={handleAssignChange}
                placeholder="Select employees..."
              />

              <input
                name="start"
                type="date"
                value={formData.start}
                onChange={handleChange}
                required
              />
              <input
                name="finish"
                type="date"
                value={formData.finish}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Done">Done</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>

              <div className="form-actions">
                <button type="submit">{isEditing ? "Update" : "Add"}</button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="status-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Task</th>
              <th>Assigned</th>
              <th>Client</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.projectId}>
                <td>{item.projectId}</td>
                <td>{item.taskList}</td>
                <td>
                  {Array.isArray(item.assigned)
                    ? item.assigned.join(", ")
                    : item.assigned}
                </td>
                <td>{item.clientName}</td>
                <td>{item.status}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditProject(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteProject(item.projectId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
