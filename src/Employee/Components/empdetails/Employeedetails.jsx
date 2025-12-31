import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaPencilAlt, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./employeeDetails.css";
import Logo from "../../assets/logo.png";

export default function Employeedetail() {
  const { id: routeParamId } = useParams();
  const location = useLocation();
  const routeStateId = location.state?.id;

  const storedId = localStorage.getItem("employeeId");

  const id = routeParamId || routeStateId || storedId;

  const [employee, setEmployee] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editedPersonal, setEditedPersonal] = useState({});
  const [editedEducation, setEditedEducation] = useState({});
  const [editedBank, setEditedBank] = useState({});
  const [educationTab] = useState("school");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  function formatDate(isoDateStr) {
    const date = new Date(isoDateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/employees/employee/${id}`)
      .then((res) => {
        console.log("Fetch status:", res.status);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Employee API Response:", data);
        setEmployee(data);
        setEditedPersonal({ maritalStatus: data.maritalStatus });
        setEditedEducation({
          schoolName: data.educationFields?.[0]?.school || "",
          degree: data.educationFields?.[0]?.degree || "",
          graduationYear: data.educationFields?.[0]?.yop || "",
          fieldOfStudy: data.educationFields?.[0]?.field || "",
          percentage: data.educationFields?.[0]?.score || "",
          marksheetUrl: data.educationFields?.[0]?.documentProofPath || "",
        });

        setEditedBank({
          emergencyContactName: data.emergencyContactName,
          emergencyContactRelation: data.emergencyContactRelation,
          emergencyPhone: data.emergencyPhone,
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setEmployee(null);
      });
  }, [id]);

  const handleDownload = async (docType) => {
    console.log("Trying to download:", {
      employeeId: employee?.empId || employee?.id,
      type: docType,
    });

    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/employees/documents/download?employeeId=${
          employee.empId || employee.id
        }&type=${docType}`
      );

      if (!response.ok) throw new Error("Document not found or server error");

      const blob = await response.blob();

      if (blob.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(errorData.message || "Download error.");
          } catch (e) {
            alert("Download failed.");
          }
        };
        reader.readAsText(blob);
        return;
      }

      let filename = `${docType}_${id}.pdf`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download the document.");
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";
    let birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      const parts = dob.includes("-") ? dob.split("-") : dob.split("/");
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        birthDate = new Date(`${yyyy}-${mm}-${dd}`);
      }
    }
    if (isNaN(birthDate.getTime())) return "-";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (e, setter) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditToggle = (section) =>
    setEditingSection((prev) => (prev === section ? null : section));

  const handleRequestUpdate = async (section) => {
    const employeeId = employee?.empId || id;
    if (!employeeId) return alert("Employee ID not found");

    let updatedData = {};

    if (section === "Personal") {
      updatedData = {
        ...employee,
        maritalStatus: editedPersonal.maritalStatus,
      };
    }

    if (section === "Education") {
      updatedData = {
        ...employee,
        empId: employeeId,
        educationFields: [
          {
            ...employee.educationFields?.[0],
            school: editedEducation.schoolName,
            degree: editedEducation.degree,
            yop: editedEducation.graduationYear,
            field: editedEducation.fieldOfStudy,
            score: editedEducation.percentage,
            documentProofPath: editedEducation.marksheetUrl,
          },
        ],
      };
    }

    if (section === "Emergency Contact") {
      updatedData = {
        ...employee,
        emergencyContactName: editedBank.emergencyContactName,
        emergencyContactRelation: editedBank.emergencyContactRelation,
        emergencyContactNumber: editedBank.emergencyPhone,
      };
    }

    try {
      const formData = new FormData();
      formData.append("employee", JSON.stringify(updatedData));

      const response = await fetch(
        `http://localhost:8080/api/employees/update/${employeeId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Update failed");

      alert(`${section} updated and admin notified!`);
      setEditingSection(null);

      const res = await fetch(
        `http://localhost:8080/api/employees/employee/${employeeId}`
      );
      const freshData = await res.json();
      setEmployee(freshData);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update. Please try again.");
    }
  };

  const education = employee?.educationFields?.[0] || {};
  const experience = employee?.experiences?.[0] || {};
  const documents = employee?.documents || {};
  const toDataURL = (url) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  const maskSensitive = (value) => {
    if (!value || typeof value !== "string") return "-";
    const last4 = value.slice(-4);
    return "XXXXXX" + last4;
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    const logoData = await toDataURL(Logo);

    doc.addImage(logoData, "PNG", 10, 10, 35, 35);

    doc.setFontSize(16);
    doc.text(employee?.fullName || "-", 50, 20);
    doc.setFontSize(12);
    doc.text(employee?.email || "-", 50, 28);
    doc.text(`Role: ${employee?.role || "-"}`, 50, 36);

    doc.setFontSize(18);
    doc.text("Bio Data", 90, 52);

    const section = (title, data) =>
      autoTable(doc, {
        startY: doc.lastAutoTable?.finalY + 10 || 60,
        head: [[title, ""]],
        body: Object.entries(data).map(([k, v]) => [k, v || "-"]),
        theme: "grid",
        styles: { fontSize: 12 },

        headStyles: { fillColor: [34, 59, 120] },
      });

    section("Personal Info", {
      "Full Name": employee?.fullName,
      "Date of Birth": formatDate(employee?.dateOfBirth),
      Email: employee?.email,
      "Contact Number": maskSensitive(employee?.contactNumber),
      Address: employee?.address,
      Gender: employee?.gender,
      "Blood Group": employee?.bloodGroup,
      "Marital Status": employee?.maritalStatus,
      Nationality: employee?.nationality,
      Religion: employee?.religion,
      "Father's Name": employee?.fathersName,
      "Mother's Name": employee?.mothersName,
      "Aadhar Number": maskSensitive(employee?.aadharNumber),
      "PAN Number": maskSensitive(employee?.panNumber),
      "Passport Number": maskSensitive(employee?.passport),
      "Driving License Number": maskSensitive(employee?.drivingLicense),
    });

    section("Education", {
      SchoolName: education?.school,
      SchoolYearOfPassing: education?.yop,
      SchoolPercentage: education.score,
      CollegeName: education?.collegeName,
      Degree: education?.degree,
      GraduationYear: education?.graduationYear,
      FieldOfStudy: education?.fieldOfStudy,
      Percentage: education?.percentage,
      MarksheetURL: education?.documentProof,
    });

    section("Bank & Emergency", {
      BankName: employee?.bankName,
      AccountName: employee?.accountName,
      AccountNo: maskSensitive(employee?.accountNumber),
      Branch: employee?.branch,
      PfNumber: maskSensitive(employee?.PfNumber),
      IFSCCode: maskSensitive(employee?.ifscCode),
      UANNumber: maskSensitive(employee?.uanNumber),
      EmergencyName: employee?.emergencyContactName,
      Relation: employee?.relation,
      Phone: maskSensitive(employee?.emergencyContactNumber),
      Payslip: employee?.paySlip,
    });

    section("Job Info", {
      "Employee Name": employee?.employeeName,
      Designation: employee?.designation,
      Department: employee?.department,
      "Date of Joining": formatDate(employee?.dateOfJoining),
      "Work Location": employee?.workLocation,
    });

    section("Previous Experience", {
      companyName: experience?.company,
      typeOfWork: experience?.type,
      position: experience?.position,
      duration: experience?.duration,
      startDate: experience?.startDate,
      endDate: experience?.endDate,
      location: experience?.location,
    });

    section("All Documents", {
      AadharCard: employee?.aadharFile,
      PANCard: employee?.PANCard,
      DrivingLicense: employee?.DrivingLicense,
      Passport: employee?.Passport,
      Experience: employee?.Experience,
      Education: employee?.Education,
    });

    doc.save(`${employee?.name || "employee"}_profile.pdf`);
  };

  const renderRow = (
    label,
    value,
    fieldName,
    editingData,
    isEditing,
    setter,
    editable = true
  ) => (
    <tr key={label}>
      <td className="label">{label}</td>
      <td className=" tabledata">
        {isEditing && fieldName && editable ? (
          <input
            type="text"
            className="custom-text-input"
            name={fieldName}
            value={editingData[fieldName] || ""}
            onChange={(e) => handleChange(e, setter)}
          />
        ) : (
          value || "-"
        )}
      </td>
    </tr>
  );

  const renderSectionHeader = (title, sectionKey) => (
    <tr className="section-header" key={sectionKey}>
      <td colSpan={2} className="section-title-with-button">
        <div className="section-title-container">
          <span>{title}</span>

          {sectionKey === "personal" && (
            <button
              className="pdf-download-button"
              onClick={handleDownloadPDF}
              style={{ marginLeft: "auto" }}
            >
              <FaDownload style={{ marginRight: 6 }} />
              Download PDF
            </button>
          )}

          {!["bank", "job", "experience", "documents"].includes(sectionKey) && (
            <span
              onClick={() => handleEditToggle(sectionKey)}
              className="edit-icon-link"
              style={{ marginLeft: 10, cursor: "pointer" }}
            >
              <FaPencilAlt className="edit-icon" title={`Edit ${title}`} />
            </span>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="profile-container">
        <div className="profile-left">
          <div className="profile-card">
            {id.startsWith("ADM") && (
              <>
                <div className="admin-panel-wrapper">
                  <Link to="/" className="admin-panel-button-top">
                    Admin Panel
                  </Link>
                </div>
              </>
            )}

            <div className="image-edit-wrapper">
              <img
                src={
                  employee?.profilePicPath?.startsWith("data:image")
                    ? employee.profilePicPath
                    : employee?.profilePicPath
                    ? `http://localhost:8080/uploads/${employee.profilePicPath}`
                    : Logo
                }
                alt="Employee"
                className="employee-image"
              />

              <Link
                to="/employee/EditImage"
                state={{ employee }}
                className="edit-icon-link photo-edit-icon"
              >
                <FaPencilAlt className="edit-icon" title="Edit Photo" />
              </Link>
            </div>

            <h2 className="profile-name">
              @{employee?.employeeName || "User-Name"}
            </h2>
            <p className="profile-email">
              {employee?.email || "user@email.com"}
            </p>
          </div>
          <div className="profile-summary">
            <h3 className="summary-title">Profile Summary</h3>
            {[
              ["Name", employee?.employeeName],
              ["DOB", formatDate(employee?.dateOfBirth)],
              ["Age", calculateAge(employee?.dateOfBirth)],
              ["Contact", employee?.contactNumber],
              ["Address", employee?.address],
              ["Blood Group", employee?.bloodGroup],
            ].map(([label, val]) => (
              <p key={label}>
                <strong>{label}:</strong> {val || "-"}
              </p>
            ))}
          </div>
        </div>

        {/* <div className="profile-right"> */}
        <div className="profile-table-scroll">
          <table className="fulltabledetails">
            <tbody className="tdbodyright">
              {renderSectionHeader("Personal Details", "personal")}
              {renderRow(
                "Marital Status",
                employee?.maritalStatus,
                "maritalStatus",
                editedPersonal,
                editingSection === "personal",
                setEditedPersonal
              )}
              {[
                ["Full Name", employee?.fullName, "name"],
                [
                  "Date of Birth",
                  formatDate(employee?.dateOfBirth),
                  "dateOfBirth",
                ],
                ["Email", employee?.email, "email"],
                ["Contact Number", employee?.contactNumber, "contactNumber"],
                ["Address", employee?.address, "address"],
                ["Gender", employee?.gender, "gender"],
                ["Blood Group", employee?.bloodGroup, "bloodGroup"],
                ["Nationality", employee?.nationality, "nationality"],
                ["Religion", employee?.religion, "religion"],
                ["Father's Name", employee?.fathersName, "fatherName"],
                ["Mother's Name", employee?.mothersName, "motherName"],
                ["Aadhar Number", employee?.aadharNumber, "aadharNo"],
                ["PAN Number", employee?.panNumber, "panNo"],
                ["Passport Number", employee?.passport, "passportNumber"],
                ["Driving License No", employee?.drivingLicense],
              ].map(([label, val]) => renderRow(label, val, null, {}, false))}

              {editingSection === "personal" && (
                <tr>
                  <td
                    className="tabledata"
                    colSpan={2}
                    style={{ textAlign: "center" }}
                  >
                    <button
                      onClick={() => handleRequestUpdate("Personal")}
                      className="request-button"
                    >
                      Save Updated
                    </button>
                  </td>
                </tr>
              )}

              {renderSectionHeader("Education Details", "education")}

              {[
                [
                  "School/College Name",
                  editedEducation.schoolName || education.school,
                  "schoolName",
                ],
                [
                  "Standard/Department",
                  editedEducation.degree || education.degree,
                  "degree",
                ],
                [
                  "Year of Passing",
                  editedEducation.graduationYear || education.yop,
                  "graduationYear",
                ],
                [
                  "Percentage / CGPA",
                  editedEducation.percentage || education.score,
                  "percentage",
                ],

                ...(educationTab === "college"
                  ? [
                      [
                        "Marksheet Upload",
                        editedEducation.marksheetUrl ||
                          employee?.documentProofPath,
                        "marksheetUrl",
                      ],
                    ]
                  : []),
              ].map(([label, val, field]) =>
                renderRow(
                  label,
                  val,
                  field,
                  editedEducation,
                  editingSection === "education",
                  setEditedEducation
                )
              )}

              {editingSection === "education" && (
                <tr>
                  <td
                    className="tabledata"
                    colSpan={2}
                    style={{ textAlign: "center" }}
                  >
                    <button
                      onClick={() => handleRequestUpdate("Education")}
                      className="request-button"
                    >
                      Save updated
                    </button>
                  </td>
                </tr>
              )}

              {renderSectionHeader("Bank Details", "bank")}

              {[
                ["Bank Name", employee?.bankName, "bankName"],
                ["Account Name", employee?.accountName, "bccountName"],
                ["Branch", employee?.branch, "bank"],
                ["PF Number", employee?.pfNumber, "pfNumber"],
                ["UAN Number", employee?.uanNumber, "uanNumber"],
                ["Account No", employee?.accountNumber, "accountNo"],
                ["IFSC Code", employee?.ifscCode, "ifscCode"],
              ].map(([label, val]) =>
                renderRow(label, val, null, {}, false, null, false)
              )}
              {renderSectionHeader("Job Info", "job")}
              {[
                ["Employee Name", employee?.employeeName],
                ["Designation", employee?.designation],
                ["Department", employee?.department],
                ["Date of Joining", formatDate(employee?.dateOfJoining)],
                ["Work Location", employee?.workLocation],
              ].map(([label, val]) =>
                renderRow(label, val, null, {}, false, null, false)
              )}

              {renderSectionHeader("Previous Experience", "experience")}
              {[
                ["Company Name", experience?.company],
                ["Type of Work", experience?.type],
                ["Position", experience?.position],
                ["Duration", experience?.duration],
                ["Start Date", formatDate(experience?.startDate)],
                ["End Date", formatDate(experience?.endDate)],
                ["Location", experience?.location],
              ].map(([label, val]) =>
                renderRow(label, val, null, {}, false, null, false)
              )}
              {renderSectionHeader("All Documents", "documents")}
              {[
                {
                  label: "Aadhar Card",
                  type: "aadhar",
                  value: documents?.aadharPath,
                },
                { label: "PAN Card", type: "pan", value: documents?.panPath },
                {
                  label: "Driving License",
                  type: "driving",
                  value: documents?.drivingLicensePath,
                },
                {
                  label: "Passport",
                  type: "passport",
                  value: documents?.passportPath,
                },
              ].map((doc) => (
                <tr key={doc.type}>
                  <td className="label">{doc.label}</td>
                  <td className="tabledata">
                    {doc.value ? "Available" : "-"}
                    <button
                      className="doc-download-btn"
                      onClick={() => {
                        if (doc.value) handleDownload(doc.type);
                        else alert("No file available.");
                      }}
                      style={{
                        marginLeft: 10,
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title={`Download ${doc.label}`}
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}

              {renderSectionHeader("Emergency Contact Details", "emergency")}

              {[
                [
                  "Emergency Contact Name",
                  employee?.emergencyContactName,
                  "emergencyContactName",
                ],

                ["Relation", employee?.relation, "emergencyContactRelation"],

                [
                  "Phone No",
                  employee?.emergencyContactNumber,
                  "emergencyPhone",
                ],
              ].map(([label, val, field]) =>
                renderRow(
                  label,

                  val,

                  field,

                  editedBank,

                  editingSection === "emergency",

                  setEditedBank,

                  true
                )
              )}

              {editingSection === "emergency" && (
                <tr>
                  <td
                    className="tabledata"
                    colSpan={2}
                    style={{ textAlign: "center" }}
                  >
                    <button
                      onClick={() => handleRequestUpdate("Emergency Contact")}
                      className="request-button"
                    >
                      Save updated
                    </button>
                  </td>
                </tr>
              )}
              <tr>
                <td className="label">Pay Slip</td>
                <td className="paydownload">
                  <input
                    type="month"
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                    min="2000-01"
                    max="2040-12"
                    className="month-year-input"
                  />
                  {selectedMonthYear && (
                    <span className="selected-label">
                      <strong>
                        {new Date(selectedMonthYear + "-01").toLocaleString(
                          "default",
                          {
                            month: "long",
                          }
                        )}
                        /{selectedMonthYear.split("-")[0]}
                      </strong>
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (!selectedMonthYear) {
                        alert("Please select a month/year.");
                        return;
                      }

                      const [year, month] = selectedMonthYear.split("-");
                      const monthName = new Date(
                        0,
                        parseInt(month) - 1
                      ).toLocaleString("default", {
                        month: "long",
                      });

                      fetch(
                        `http://localhost:8080/api/payslip/download?employeeId=${employee.id}&month=${month}&year=${year}`
                      )
                        .then((res) => {
                          if (!res.ok) throw new Error("Payslip not found");
                          return res.blob();
                        })
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${employee.name}_Payslip_${monthName}_${year}.pdf`;
                          a.click();
                        })
                        .catch((err) => {
                          alert("Payslip not found or backend not ready.");
                          console.error(err);
                        });
                    }}
                    className="payslip-download-btn"
                    title="Download Payslip"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
