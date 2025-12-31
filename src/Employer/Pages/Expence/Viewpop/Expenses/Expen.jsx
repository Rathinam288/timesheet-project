import React, { useState, useEffect } from "react";
import "./Expen.css";
import axios from "axios";
import ActionButton from "../Button/Download";
import View from "../Button/View";
import Popup from "../Viewpop/Popup";
import Pdfpop from "../Downpop/Pdfpop";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNotification } from "../../../../Components/Notification/NotificationContext";

const API_URL = "http://localhost:8080/api/invoices";
const statusOptions = ["Active", "Completed", "Pending"];

const Expenses = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCardView, setIsCardView] = useState(true);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const { addNotification } = useNotification();

  const [editingId, setEditingId] = useState(null);

  const empty = {
    inId: "",
    name: "",
    date: "",
    type: "",
    description: "",
    quantity: 1,
    item_name: "",
    client: "",
    status: "",
    exDate: "",
    amount: 0,
    billImage: "",
  };

  const acknowledgedIds = ["ST001", "ST002"];
  const [newItem, setNewItem] = useState(empty);
  const gstRate = 0.18;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const itemsWithImages = res.data.map((item) => {
          const storedImage = localStorage.getItem(
            `invoice_image_${item.inId}`
          );
          return { ...item, billImage: storedImage || item.billImage };
        });
        setItems(itemsWithImages);
      })
      .catch(console.error);
  }, []);

  const calculateGST = (amt) => parseFloat(amt) * gstRate || 0;
  const calculateTotal = (amt) => parseFloat(amt) + calculateGST(amt);

  const handleChange = (field, value) => {
    const isNumericField = ["quantity", "amount"].includes(field);
    const parsedValue = isNumericField
      ? value === ""
        ? ""
        : parseFloat(value)
      : value;
    setNewItem((prev) => ({ ...prev, [field]: parsedValue }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBase64 = reader.result;
        setNewItem((prev) => {
          const updated = { ...prev, billImage: imageBase64 };
          if (updated.inId) {
            localStorage.setItem(`invoice_image_${updated.inId}`, imageBase64);
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!isAcknowledged) {
      alert("Please acknowledge the data before saving.");
      return;
    }

    const requiredFields = [
      "inId",
      "name",
      "date",
      "type",
      "description",
      "quantity",
      "item_name",
      "client",
      "status",
      "exDate",
      "amount",
    ];

    for (let field of requiredFields) {
      if (
        newItem[field] === undefined ||
        newItem[field] === null ||
        newItem[field].toString().trim() === ""
      ) {
        alert("Please fill all the fields");
        return;
      }
    }

    const imageData = newItem.billImage
      ? newItem.billImage.split(",")[1]
      : null;

    const payload = {
      ...newItem,
      imageData: imageData,
      uploadFileName: "invoice.jpg",
    };

    try {
      if (editingId) {
        if (editingId !== newItem.inId) {
          // ✅ ID changed → delete old and add new
          await axios.delete(`${API_URL}/${editingId}`);
          await axios.post(API_URL, payload);
          setItems((prev) =>
            prev.map((i) => (i.inId === editingId ? { ...newItem } : i))
          );
        } else {
          await axios.put(`${API_URL}/${newItem.inId}`, payload);
          setItems((prev) =>
            prev.map((i) => (i.inId === newItem.inId ? { ...newItem } : i))
          );
        }
      } else {
        await axios.post(API_URL, payload);
        setItems([...items, newItem]);
      }

      if (newItem.billImage) {
        localStorage.setItem(
          `invoice_image_${newItem.inId}`,
          newItem.billImage
        );
      }

      if (newItem && newItem.inId && newItem.amount && newItem.item_name) {
        addNotification(
          "Expense Added",
          `Expense entry submitted.`,
          null,
          "System",
          newItem.projectId || "",
          {
            inId: newItem.inId,
            amount: newItem.amount,
            item_name: newItem.item_name,
          }
        );
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleDelete = async (inId) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await axios.delete(`${API_URL}/${inId}`);
      localStorage.removeItem(`invoice_image_${inId}`);
      setItems(items.filter((i) => i.inId !== inId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const openEdit = (i) => {
    setNewItem(i);
    setEditingId(i.inId);
    setIsAcknowledged(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewItem(empty);
    setEditingId(null);
    setIsAcknowledged(false);
    setModalOpen(false);
  };
  const filteredItems = items.filter((item) => {
    const matchDate = filterDate ? item.date === filterDate : true;
    const matchType = filterType ? item.type === filterType : true;
    return matchDate && matchType;
  });

  const uniqueTypes = [...new Set(items.map((i) => i.type))];

  return (
    <div className="invoice-container">
      <h2>Expenses</h2>

      <div className="filters">
        <label>
          Filter by Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <label>
          Filter by Type:
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All</option>
            {uniqueTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="toggle-view-btn"
        onClick={() => setIsCardView((prev) => !prev)}
      >
        {isCardView ? "Switch to Table View" : "Switch to Card View"}
      </button>

      <button
        className="add-btn"
        onClick={() => {
          setModalOpen(true);
          setIsAcknowledged(false);
        }}
      >
        Add Row
      </button>

      {isCardView ? (
        <div className="expenses-card-container">
          {filteredItems.length === 0 ? (
            <p>No items</p>
          ) : (
            filteredItems.map((item) => (
              <div key={item.inId} className="expenses-card">
                <h4>
                  {item.name} (#{item.inId})
                </h4>
                <p>
                  <strong>Date:</strong> {item.date}
                </p>
                <p>
                  <strong>Type:</strong> {item.type}
                </p>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Item:</strong> {item.item_name}
                </p>
                <p>
                  <strong>Client:</strong> {item.client}
                </p>
                <p>
                  <strong>Status:</strong> {item.status}
                </p>
                <p>
                  <strong>Expires:</strong> {item.exDate}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{(+item.amount).toFixed(2)}
                </p>
                <p>
                  <strong>GST:</strong> ₹{calculateGST(item.amount).toFixed(2)}
                </p>
                <p>
                  <strong>Total:</strong> ₹
                  {calculateTotal(item.amount).toFixed(2)}
                </p>
                {item.billImage && (
                  <img
                    src={item.billImage}
                    alt="Bill"
                    className="expenses-card-bill-img"
                    onClick={() => setSelectedImage(item.billImage)}
                  />
                )}
                <div className="expenses-card-actions">
                  <button
                    className="icon-btn"
                    onClick={() => openEdit(item)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDelete(item.inId)}
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                  <ActionButton onClick={() => setSelectedItem(item)} />
                  <View onClick={() => setSelectedItem(item)} />
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Item</th>
              <th>Client</th>
              <th>Status</th>
              <th>Expire</th>
              <th>Amount</th>
              <th>GST</th>
              <th>Total</th>
              <th>Bill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="15" style={{ textAlign: "center" }}>
                  No items
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.inId}>
                  <td>{item.inId}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.type}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.item_name}</td>
                  <td>{item.client}</td>
                  <td>{item.status}</td>
                  <td>{item.exDate}</td>
                  <td>{(+item.amount).toFixed(2)}</td>
                  <td>{calculateGST(item.amount).toFixed(2)}</td>
                  <td>{calculateTotal(item.amount).toFixed(2)}</td>
                  <td>
                    {item.billImage ? (
                      <img
                        src={item.billImage}
                        className="thumbnail"
                        onClick={() => setSelectedImage(item.billImage)}
                        alt="bill"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(item.inId)}
                    >
                      Delete
                    </button>
                    <ActionButton onClick={() => setSelectedItem(item)} />
                    <View onClick={() => setSelectedItem(item)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {selectedImage && (
        <div className="image-lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Bill" />
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="edith3">
              {newItem.inId ? "Edit Invoice" : "Add New Invoice"}
            </h3>
            <div className="modal-form">
              {[
                ["inId", "text"],
                ["name", "text"],
                ["date", "date"],
                ["type", "text"],
                ["description", "text"],
                ["quantity", "number"],
                ["item_name", "text"],
                ["client", "text"],
                ["exDate", "date"],
                ["amount", "number"],
              ].map(([f, t]) => (
                <label key={f}>
                  {f.replace(/([A-Z])/g, " $1")}
                  <input
                    type={t}
                    value={newItem[f] !== undefined ? newItem[f] : ""}
                    onChange={(e) => handleChange(f, e.target.value)}
                  />
                </label>
              ))}
              <label>
                Status:
                <select
                  className="styled-select"
                  value={newItem.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option, idx) => (
                    <option
                      key={idx}
                      value={option}
                      className={`status-option status-${option.toLowerCase()}`}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Bill Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              {newItem.billImage && (
                <img
                  src={newItem.billImage}
                  alt="preview"
                  style={{ width: 100, marginTop: 10 }}
                />
              )}
              <label className="ack-checkbox">
                <input
                  type="checkbox"
                  checked={isAcknowledged}
                  onChange={(e) => setIsAcknowledged(e.target.checked)}
                />
                I acknowledge that the data entered is accurate.
              </label>
            </div>
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <>
          {acknowledgedIds.includes(selectedItem.inId) && (
            <div className="acknowledge-popup">
              <p>Acknowledged for invoice #{selectedItem.inId}</p>
              <button onClick={() => setSelectedItem(null)}>OK</button>
            </div>
          )}
          <Popup
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            calculateGST={calculateGST}
            calculateTotal={calculateTotal}
          />
          <Pdfpop
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            calculateGST={calculateGST}
            calculateTotal={calculateTotal}
          />
        </>
      )}
    </div>
  );
};

export default Expenses;
