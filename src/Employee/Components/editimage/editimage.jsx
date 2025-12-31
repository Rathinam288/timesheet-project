import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./editimage.css";

const EditImage = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeParamId } = useParams();
  const routeStateId = location.state?.id;

  const storedId = localStorage.getItem("employeeId");
  const id = routeParamId || routeStateId || storedId;

  useEffect(() => {
    if (!id) {
      setMessage({ type: "error", text: "Employee ID not found" });
      return;
    }

    fetch(`http://localhost:8080/api/employees/employee/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (!data.empId) {
          data.empId = id;
        }
        setProfile(data);
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message });
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profilePicPath: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const employeeId = profile?.empId || id;
    if (!employeeId) {
      setMessage({ type: "error", text: "Employee ID is missing!" });
      return;
    }

    fetch(`http://localhost:8080/api/employees/update/image/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profilePicPath: profile.profilePicPath }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update image");
        return res.text();
      })
      .then(() => {
        setMessage({
          type: "success",
          text: "Profile image updated successfully",
        });
        setTimeout(() => {
          navigate(`/employee/Profile/${employeeId}`);
        }, 1000);
      })
      .catch((err) => {
        setMessage({ type: "error", text: err.message });
      });
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="edit-profile-container" style={{ maxWidth: 600 }}>
      <h2>Update Profile Image</h2>
      {message && (
        <div
          style={{
            color: message.type === "error" ? "red" : "green",
            marginBottom: 10,
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="newphoto">Upload New Photo:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {profile.profilePicPath ? (
            <img
              src={profile.profilePicPath}
              alt="Preview"
              className="employee-profile-pic-preview"
            />
          ) : (
            <div>No Photo</div>
          )}
        </div>

        <div className="button-group" style={{ marginTop: 20 }}>
          <button type="submit" className="form-button">
            Update Image
          </button>
          <button
            type="button"
            className="form-button"
            onClick={() => navigate(`/employee/Profile/${profile.empId || id}`)}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditImage;
