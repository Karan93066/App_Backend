import React, { useEffect, useState } from "react";
import axios from "axios";

const SubAdminPanel = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [formState, setFormState] = useState({ id: null, name: "", password: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState("view"); // "add" or "view"

  // Fetch sub-admins from the server
  useEffect(() => {
    axios.get("http://localhost:3001/api/subadmin").then((res) => setSubAdmins(res.data));
  }, []);

  // Handle delete sub-admin
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/api/subadmin/${id}`).then(() => {
      setSubAdmins(subAdmins.filter((admin) => admin.id !== id));
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdating) {
      // Update sub-admin
      axios.put(`http://localhost:3001/api/subadmin/${formState.id}`, formState).then(() => {
        setSubAdmins((prev) =>
          prev.map((admin) => (admin.id === formState.id ? formState : admin))
        );
        resetForm();
        setViewMode("view");
      });
    } else {
      // Add new sub-admin
      axios.post("http://localhost:3001/api/subadmin", formState).then((res) => {
        setSubAdmins([...subAdmins, res.data]);
        resetForm();
        setViewMode("view");
      });
    }
  };

  // Handle update click and prefill form
  const handleUpdate = (admin) => {
    setFormState(admin);
    setIsUpdating(true);
    setViewMode("add");
  };

  // Reset form state
  const resetForm = () => {
    setFormState({ id: null, name: "", password: "" });
    setIsUpdating(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Sub-Admin Panel</h1>

      {/* Switch Between Add/View */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-l-lg ${
            viewMode === "view" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewMode("view")}
        >
          View All Sub-admins
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg ${
            viewMode === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            resetForm();
            setViewMode("add");
          }}
        >
          Add Sub-admin
        </button>
      </div>

      {/* Add Sub-admin Form */}
      {viewMode === "add" && (
        <form
          className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-4">
            {isUpdating ? "Update Sub-admin" : "Add Sub-admin"}
          </h2>
          <input
            type="text"
            placeholder="Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            className="border p-3 rounded w-full mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formState.password}
            onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            className="border p-3 rounded w-full mb-4"
            required
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className={`${
                isUpdating ? "bg-yellow-500" : "bg-blue-500"
              } text-white px-4 py-2 rounded w-full`}
            >
              {isUpdating ? "Update Sub-admin" : "Add Sub-admin"}
            </button>
            {isUpdating && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-4 bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* View All Sub-admins */}
      {viewMode === "view" && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sub-admin List</h2>
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{admin.name}</td>
                  <td className="border px-4 py-2 flex items-center space-x-2">
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded"
                      onClick={() => handleUpdate(admin)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subAdmins.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No sub-admins found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SubAdminPanel;
