import React, { useState, useEffect } from "react";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    mrp: "",
    discount_percentage: "",
    actual_price: "",
    days: "30", // Default to monthly
    isActive: "1",
    background_image: null,
    existing_image: "",
  });
  const [customDays, setCustomDays] = useState("");
  const [customDaysError, setCustomDaysError] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'add'
  const [imagePreview, setImagePreview] = useState(""); // Preview of background image
  const apiUrl = "http://localhost:3001/api/packages";

  console.log(formData.days);

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount_percentage" || name === "mrp") {
      const mrp =
        name === "mrp" ? parseFloat(value) || 0 : parseFloat(formData.mrp) || 0;
      const discount =
        name === "discount_percentage"
          ? parseInt(value) || 0
          : parseInt(formData.discount_percentage) || 0;
      const actualPrice = mrp - (mrp * discount) / 100;
      setFormData({
        ...formData,
        actual_price: actualPrice.toFixed(2),
        [name]: value,
      });
    } else if (name === "days") {
      if (value === "Custom") {
        setFormData((prev) => ({ ...prev, days: "" })); // Clear days in formData
        setCustomDays(""); // Reset custom days input
        setCustomDaysError(""); // Clear error
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setCustomDays(""); // Reset custom days input
        setCustomDaysError(""); // Clear error
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, background_image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCustomDaysChange = (e) => {
    const value = e.target.value;

    // Validate the custom days value
    if (value === "" || /^[0-9]*$/.test(value)) {
      setCustomDays(value);
      setCustomDaysError(""); // Clear any previous error
    }
  };

  const handleCustomDaysBlur = () => {
    const days = parseInt(customDays, 10);
    if (days >= 10 && days <= 365) {
      setFormData((prev) => ({ ...prev, days }));
      setCustomDaysError(""); // Clear error
    } else if (customDays) {
      setCustomDaysError("Days must be between 10 and 365.");
    }
  };

  // Handle form submission for add/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `${apiUrl}/${formData.id}` : apiUrl;
    if (formData.days === "") {
      setCustomDaysError("Please enter a valid number of days.");
      return;
    }
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("mrp", formData.mrp);
    formDataToSubmit.append(
      "discount_percentage",
      formData.discount_percentage
    );
    formDataToSubmit.append("actual_price", formData.actual_price);
    formDataToSubmit.append("days", formData.days);
    formDataToSubmit.append("isActive", formData.isActive);
    if (formData.background_image) {
      formDataToSubmit.append("background_image", formData.background_image);
    }

    console.log(formData.days);
    // try {
    //   await fetch(url, {
    //     method,
    //     body: formDataToSubmit,
    //   });
    //   setFormData({
    //     id: "",
    //     mrp: "",
    //     discount_percentage: "",
    //     actual_price: "",
    //     days: "30",
    //     isActive: "",
    //     background_image: null,
    //     existing_image: "",
    //   });
    //   setCustomDays(""); // Reset custom days
    //   setImagePreview("");
    // setCustomDaysError("");
    //   fetchPackages();
    //   setViewMode("list");
    // } catch (error) {
    //   console.error("Error saving package:", error);
    // }
  };

  // Handle editing a package
  const handleEdit = (pkg) => {
    setFormData({
      ...pkg,
      existing_image: pkg.background_image || "",
      background_image: null, // Reset file input
    });
    setImagePreview(
      pkg.background_image
        ? `http://localhost:3001/${pkg.background_image}`
        : ""
    );
    if (pkg.days < 10 || pkg.days > 365) {
      setCustomDays(pkg.days); // Show custom value in input
    } else {
      setCustomDays(""); // Reset custom days
    }
    setViewMode("add");
  };

  // Handle deleting a package
  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 p-6">
      <div className="mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Package Management</h1>
          <button
            onClick={() => setViewMode(viewMode === "list" ? "add" : "list")}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-all">
            {viewMode === "list" ? "Add Package" : "View All Packages"}
          </button>
        </div>

        {viewMode === "add" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">MRP:</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium">
                  Discount Percentage:
                </label>
                <input
                  type="number"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Actual Price:</label>
                <input
                  type="number"
                  name="actual_price"
                  value={formData.actual_price}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Days</label>
                <select
                  name="days"
                  value={formData.days || ""}
                  onChange={handleInputChange}
                  className="border p-2 w-full">
                  <option value="">Select Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">365 Days</option>
                  <option value="Custom">Custom</option>
                </select>
                {formData.days === "" && (
                  <input
                    type="text"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    onBlur={handleCustomDaysBlur}
                    placeholder="Enter custom days (10-365)"
                    className="border p-2 w-full mt-2"
                  />
                )}
                {customDaysError && (
                  <p className="text-red-500 text-sm">{customDaysError}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block font-medium">Background Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full object-cover mt-4 rounded"
                />
              )}
            </div>
            <div>
              <label className="block font-medium">Active:</label>
              <select
                name="isActive"
                value={formData.isActive}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2">
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded shadow-md hover:bg-blue-700 transition-all">
              Save Package
            </button>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Background Image</th>
                  <th className="border px-4 py-2">MRP</th>
                  <th className="border px-4 py-2">Discount (%)</th>
                  <th className="border px-4 py-2">Actual Price</th>
                  <th className="border px-4 py-2">Days</th>
                  <th className="border px-4 py-2">Active</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="border px-4 py-2">
                      <img
                        src={`http://localhost:3001/${pkg.background_image}`}
                        alt=""
                        className="h-10 w-10 object-cover"
                      />
                    </td>
                    <td className="border px-4 py-2">{pkg.mrp}</td>
                    <td className="border px-4 py-2">
                      {pkg.discount_percentage}
                    </td>
                    <td className="border px-4 py-2">{pkg.actual_price}</td>
                    <td className="border px-4 py-2">{pkg.days}</td>
                    <td className="border px-4 py-2">{pkg.isActive}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="px-2 py-1 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-all">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-all">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
