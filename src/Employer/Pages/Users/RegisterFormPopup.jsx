import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatar from "../../assets/avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./RegisterFormPopup.css";
import axios from "axios";

const RegisterFormPopup = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const employeesPerPage = 5;

  const [filters, setFilters] = useState({
    searchValue: "",
  });

  const filteredEmployees = employees.filter((employee) => {
    if (!filters.searchValue) return true;

    const searchTerm = filters.searchValue.toLowerCase();

    return (
      employee.empId.toLowerCase().includes(searchTerm) ||
      employee.employeeName.toLowerCase().includes(searchTerm) ||
      (employee.designation &&
        employee.designation.toLowerCase().includes(searchTerm)) ||
      (employee.department &&
        employee.department.toLowerCase().includes(searchTerm)) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm)) ||
      (employee.contactNumber &&
        employee.contactNumber.toLowerCase().includes(searchTerm))
    );
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [formData, setFormData] = useState({
    profilePic: null,
    employeeName: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    workLocation: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    contactNumber: "",
    address: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    nationality: "",
    religion: "",
    fathersName: "",
    mothersName: "",
    aadharNumber: "",
    panNumber: "",
    passport: "",
    drivingLicense: "",
    emergencyContactName: "",
    relation: "",
    emergencyContactNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    branch: "",
    pfNumber: "",
    ifscCode: "",
    uanNumber: "",
    educationFields: [
      { school: "", degree: "", yop: "", field: "", score: "" },
    ],
    experiences: [
      {
        company: "",
        type: "",
        position: "",
        duration: "",
        startDate: "",
        endDate: "",
        location: "",
        experienceLetter: null,
        payslips: [],
      },
    ],
    documents: {
      aadharFile: null,
      panFile: null,
      passportFile: null,
      drivingLicenseFile: null,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name.startsWith("documents.")) {
        const docField = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          documents: { ...prev.documents, [docField]: files[0] },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(file),
        profilePicFile: file,
      }));
      toast.success("Profile picture uploaded!");
    } else {
      toast.error("Please select an image file");
    }
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...formData.educationFields];
    updatedEducation[index][name] = value;
    setFormData((prev) => ({ ...prev, educationFields: updatedEducation }));
  };

  const addEducationField = () => {
    setFormData((prev) => ({
      ...prev,
      educationFields: [
        ...prev.educationFields,
        { school: "", degree: "", yop: "", field: "", score: "" },
      ],
    }));
  };

  const removeEducationField = (index) => {
    const updated = formData.educationFields.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, educationFields: updated }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index][field] = value;
    setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
  };

  const addExperienceField = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          company: "",
          type: "",
          position: "",
          duration: "",
          startDate: "",
          endDate: "",
          location: "",
          experienceLetter: null,
          payslips: [],
        },
      ],
    }));
  };

  const removeExperienceField = (index) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  const handlePayslipChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index].payslips = files;
    setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      toast.error("Error fetching employees");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitted) return; // Prevent submitting multiple times

    setIsSubmitted(true); // Freeze button on click

    try {
      // Your submission logic here
      // e.g., axios call, toast messages etc.

      // After successful submit, close modal & reset form if needed
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentEmployee(null);
      setCurrentPage(1);
    } catch (error) {}

    const empId = isEditMode ? currentEmployee.empId : null;

    const formDataToSend = new FormData();

    const employeeOnlyFields = {
      empId,
      profilePic: formData.profilePicFile,
      employeeName: formData.employeeName,
      designation: formData.designation,
      role: formData.role,
      department: formData.department,
      dateOfJoining: formData.dateOfJoining,
      workLocation: formData.workLocation,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      contactNumber: formData.contactNumber,
      address: formData.address,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      maritalStatus: formData.maritalStatus,
      nationality: formData.nationality,
      religion: formData.religion,
      fathersName: formData.fathersName,
      mothersName: formData.mothersName,
      aadharNumber: formData.aadharNumber,
      panNumber: formData.panNumber,
      passport: formData.passport,
      drivingLicense: formData.drivingLicense,
      emergencyContactName: formData.emergencyContactName,
      relation: formData.relation,
      emergencyContactNumber: formData.emergencyContactNumber,
      bankName: formData.bankName,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      branch: formData.branch,
      pfNumber: formData.pfNumber,
      ifscCode: formData.ifscCode,
      uanNumber: formData.uanNumber,
      educationFields: formData.educationFields,
      experiences: formData.experiences,
    };

    employeeOnlyFields.educationFields = formData.educationFields || [];
    // employeeOnlyFields.experiences = formData.experiences || [];
    employeeOnlyFields.experiences = (formData.experiences || []).map(
      (exp) => ({
        company: exp.company || "",
        type: exp.type || "",
        position: exp.position || "",
        duration: exp.duration || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        location: exp.location || "",
        experienceLetterPath: "",
        payslipPaths: [],
      })
    );

    employeeOnlyFields.documents = {};

    const employeeJson = JSON.stringify(employeeOnlyFields);
    formDataToSend.append("employee", employeeJson);

    if (formData.profilePicFile) {
      formDataToSend.append("profilePic", formData.profilePicFile);
    }

    if (formData.documents) {
      if (formData.documents.aadharFile) {
        formDataToSend.append("aadharFile", formData.documents.aadharFile);
      }
      if (formData.documents.panFile) {
        formDataToSend.append("panFile", formData.documents.panFile);
      }
      if (formData.documents.passportFile) {
        formDataToSend.append("passportFile", formData.documents.passportFile);
      }
      if (formData.documents.drivingLicenseFile) {
        formDataToSend.append(
          "drivingLicenseFile",
          formData.documents.drivingLicenseFile
        );
      }
    }

    formData.educationFields?.forEach((edu, index) => {
      if (edu.documentProofFile) {
        formDataToSend.append("educationDocs", edu.documentProofFile);
      }
    });

    formData.experiences?.forEach((exp, index) => {
      if (exp.experienceLetter) {
        formDataToSend.append("experienceLetters", exp.experienceLetter);
      }
      if (Array.isArray(exp.payslips)) {
        exp.payslips.forEach((file) => {
          formDataToSend.append("payslips", file);
        });
      }
    });

    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/employees/update/${currentEmployee.empId}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Employee updated successfully!");
      } else {
        await axios.post(
          `http://localhost:8080/api/employees/register`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Employee added successfully!");
      }

      await fetchEmployees();

      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentEmployee(null);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error saving employee:", err);
      toast.error("Error while submitting. Please check inputs.");
    }
  };

  const handleEditEmployee = (employee) => {
    setFormData(employee);
    setIsEditMode(true);
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (empId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/employees/delete/${empId}`
        );

        await axios.delete(`http://localhost:8080/api/deleteUser/${empId}`, {
          withCredentials: true,
        });
        setEmployees((prev) => prev.filter((emp) => emp.empId !== empId));
        toast.success("Employee deleted successfully!");
        if (employees.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Failed to delete employee:", err);
        toast.error("Failed to delete employee.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="employee-management-container">
      <ToastContainer position="top-right" />

      <div className="header-section">
        <h1>Employee Management</h1>
        <button
          className="add-employee-btn"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false);
            setCurrentEmployee(null);
            setIsSubmitted(false); // Reset submit button if frozen

            // Reset form data to default (empty)
            setFormData({
              profilePic: null,
              employeeName: "",
              designation: "",
              department: "",
              dateOfJoining: "",
              workLocation: "",
              fullName: "",
              dateOfBirth: "",
              email: "",
              contactNumber: "",
              address: "",
              gender: "",
              bloodGroup: "",
              maritalStatus: "",
              nationality: "",
              religion: "",
              fathersName: "",
              mothersName: "",
              aadharNumber: "",
              panNumber: "",
              passport: "",
              drivingLicense: "",
              emergencyContactName: "",
              relation: "",
              emergencyContactNumber: "",
              bankName: "",
              accountName: "",
              accountNumber: "",
              branch: "",
              pfNumber: "",
              ifscCode: "",
              uanNumber: "",
              educationFields: [
                { school: "", degree: "", yop: "", field: "", score: "" },
              ],
              experiences: [
                {
                  company: "",
                  type: "",
                  position: "",
                  duration: "",
                  startDate: "",
                  endDate: "",
                  location: "",
                  experienceLetter: null,
                  payslips: [],
                },
              ],
              documents: {
                aadharFile: null,
                panFile: null,
                passportFile: null,
                drivingLicenseFile: null,
              },
            });
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Employee
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search employees..."
            value={filters.searchValue}
            onChange={(e) => setFilters({ searchValue: e.target.value })}
          />
          {filters.searchValue && (
            <button
              className="clear-filter-btn"
              onClick={() => setFilters({ searchValue: "" })}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      </div>

      {/* Employee Table View */}
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-employees">
                  {employees.length === 0
                    ? "No employees found. Add your first employee!"
                    : "No employees match your filters"}
                </td>
              </tr>
            ) : (
              currentEmployees.map((employee) => (
                <tr className="employee-row" key={employee.empId}>
                  <td>{employee.empId}</td>
                  <td>
                    <div className="employee-name-cell">
                      <img
                        src={
                          employee?.profilePicPath?.startsWith("data:image")
                            ? employee.profilePicPath
                            : employee?.profilePicPath
                            ? `http://localhost:8080/uploads/${employee.profilePicPath}`
                            : avatar
                        }
                        alt={employee.employeeName}
                        className="employee-avatar"
                      />
                    </div>
                  </td>
                  <td>{employee.employeeName}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.department}</td>
                  <td>{formatDate(employee.dateOfJoining)}</td>
                  <td>{employee.email}</td>
                  <td>{employee.contactNumber}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteEmployee(employee.empId)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredEmployees.length > employeesPerPage && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={currentPage === number ? "active" : ""}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditMode ? "Edit Employee" : "Add New Employee"}</h2>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
              {/* Profile Picture Section */}
              <div className="form-section">
                <h3>Upload Employee Profile Picture</h3>
                <div className="profile-upload">
                  <label htmlFor="profilePic" className="profile-label">
                    <img
                      src={
                        formData.profilePic
                          ? formData.profilePic
                          : formData.profilePicPath
                          ? `http://localhost:8081/uploads/profile_pics/${formData.profilePicPath}`
                          : avatar
                      }
                      alt="Profile"
                      className="profile-preview"
                    />
                  </label>
                </div>
              </div>

              {/* Employee Details Section */}
              <div className="form-section">
                <h3>Employee Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Upload Profile Picture</label>

                    <input
                      type="file"
                      name="profilePicFile" // Changed from "profilePic" to "profilePicFile"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="file-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Employee Name*</label>
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      placeholder="Enter Employee Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation*</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Enter Designation"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role*</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN_EMPLOYEE">Admin + Employee</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Department*</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter Department"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Joining*</label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Work Location</label>
                    <input
                      type="text"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      placeholder="Enter Work Location"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="form-section">
                <h3>Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth*</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number*</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Contact Number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter Address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      placeholder="Enter Nationality"
                    />
                  </div>
                  <div className="form-group">
                    <label>Religion</label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      placeholder="Enter Religion"
                    />
                  </div>
                  <div className="form-group">
                    <label>Father's Name</label>
                    <input
                      type="text"
                      name="fathersName"
                      value={formData.fathersName}
                      onChange={handleInputChange}
                      placeholder="Enter Father's Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <input
                      type="text"
                      name="mothersName"
                      value={formData.mothersName}
                      onChange={handleInputChange}
                      placeholder="Enter Mother's Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="Enter Contact Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Relation</label>
                    <input
                      type="text"
                      name="relation"
                      value={formData.relation}
                      onChange={handleInputChange}
                      placeholder="Enter Relation"
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Number</label>
                    <input
                      type="tel"
                      name="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Contact Number"
                    />
                  </div>
                </div>
              </div>

              {/* Document Details Section */}
              <div className="form-section">
                <h3>Document Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Aadhar Number</label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Aadhar Number"
                    />
                  </div>
                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="Enter PAN Number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Passport</label>
                    <input
                      type="text"
                      name="passport"
                      value={formData.passport}
                      onChange={handleInputChange}
                      placeholder="Enter Passport Number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Driving License</label>
                    <input
                      type="text"
                      name="drivingLicense"
                      value={formData.drivingLicense}
                      onChange={handleInputChange}
                      placeholder="Enter Driving License Number"
                    />
                  </div>
                </div>
              </div>

              {/* Education Details Section */}
              <div className="form-section">
                <h3>Education Details</h3>
                {formData.educationFields.map((edu, index) => (
                  <div key={index} className="education-entry">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>School/College Name</label>
                        <input
                          type="text"
                          name="school"
                          value={edu.school}
                          onChange={(e) => handleEducationChange(index, e)}
                          placeholder="Enter school/college name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, e)}
                          placeholder="Enter degree"
                        />
                      </div>
                      <div className="form-group">
                        <label>Year of Passing</label>
                        <input
                          type="text"
                          name="yop"
                          value={edu.yop}
                          onChange={(e) => handleEducationChange(index, e)}
                          placeholder="Enter year of passing"
                        />
                      </div>
                      <div className="form-group">
                        <label>Field of Study</label>
                        <input
                          type="text"
                          name="field"
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, e)}
                          placeholder="Enter field of study"
                        />
                      </div>
                      <div className="form-group">
                        <label>Percentage/CGPA</label>
                        <input
                          type="text"
                          name="score"
                          value={edu.score}
                          onChange={(e) => handleEducationChange(index, e)}
                          placeholder="Enter percentage/cgpa"
                        />
                      </div>
                      <div className="form-group">
                        <label>Document Proof</label>
                        <select
                          name="documentProof"
                          value={edu.documentProof}
                          onChange={(e) => handleEducationChange(index, e)}
                        >
                          <option value="">Select Document Proof</option>
                          <option value="10th Certificate">
                            {" "}
                            10th Certificate
                          </option>
                          <option value="12th Certificate">
                            12th Certificate
                          </option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor">Bachelor Degree</option>
                          <option value="Master">Master Degree</option>
                          <option value="Transcript">Transcript</option>
                          <option value="Marksheet">Marksheet</option>
                        </select>
                        <input
                          type="file"
                          className="file-input"
                          onChange={(e) =>
                            handleEducationChange(index, {
                              target: {
                                name: "documentProof",
                                value: e.target.files[0],
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    {formData.educationFields.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeEducationField(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-more-btn"
                  onClick={addEducationField}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Education
                </button>
              </div>

              {/* Bank Details Section */}
              <div className="form-section">
                <h3>Bank Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter Bank Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Name</label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="Enter Account Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Account Number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="Enter Branch Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>PF Number</label>
                    <input
                      type="text"
                      name="pfNumber"
                      value={formData.pfNumber}
                      onChange={handleInputChange}
                      placeholder="Enter PF Number"
                    />
                  </div>
                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="Enter IFSC Code"
                    />
                  </div>
                  <div className="form-group">
                    <label>UAN Number</label>
                    <input
                      type="text"
                      name="uanNumber"
                      value={formData.uanNumber}
                      onChange={handleInputChange}
                      placeholder="Enter UAN Number"
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="form-section">
                <h3>Work Experience</h3>
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="experience-entry">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          placeholder="Enter Company Name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "position",
                              e.target.value
                            )
                          }
                          placeholder="Enter Position"
                        />
                      </div>
                      <div className="form-group">
                        <label>Type of work</label>
                        <select
                          value={exp.type}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="Enter Duration (e.g. 2 years)"
                        />
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="Enter Location"
                        />
                      </div>
                      {formData.experiences.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeExperienceField(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Experience Letter</label>
                      <input
                        type="file"
                        className="file-input"
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "experienceLetter",
                            e.target.files[0]
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Payslip</label>
                      <input
                        type="file"
                        className="file-input"
                        multiple
                        onChange={(e) => handlePayslipChange(index, e)}
                      />
                      <small className="file-info">
                        Upload payslips for at least 3 months
                      </small>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-more-btn"
                  onClick={addExperienceField}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Experience
                </button>
              </div>

              {/* Documents for Verification Section */}
              <div className="form-section">
                <h3>Documents for Verification</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Upload Aadhar Card</label>
                    <input
                      type="file"
                      name="documents.aadharFile"
                      onChange={handleInputChange}
                      className="file-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload PAN Card</label>
                    <input
                      type="file"
                      name="documents.panFile"
                      onChange={handleInputChange}
                      className="file-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload Passport</label>
                    <input
                      type="file"
                      name="documents.passportFile"
                      onChange={handleInputChange}
                      className="file-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload Driving License</label>
                    <input
                      type="file"
                      name="documents.drivingLicenseFile"
                      onChange={handleInputChange}
                      className="file-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="add-employee-btn"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsEditMode(false);
                    setCurrentEmployee(null);
                    setIsSubmitted(false);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterFormPopup;
