import React, { useEffect, useState } from "react";
import axios from "axios";

const Offers = () => {
  const [activeComponent, setActiveComponent] = useState("list");
  const [editOffer, setEditOffer] = useState(null);

  const handleSwitch = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="mb-6 flex flex-wrap justify-center md:justify-end space-x-2">
        <button
          onClick={() => {
            setEditOffer(null);
            handleSwitch("list");
          }}
          className={`px-4 py-2 rounded transition-all ${
            activeComponent === "list"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          View Offers
        </button>
        <button
          onClick={() => handleSwitch("add")}
          className={`px-4 py-2 rounded transition-all ${
            activeComponent === "add"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          Add Offer
        </button>
      </nav>
      <div>
        {activeComponent === "list" ? (
          <OffersList handleSwitch={handleSwitch} setEditOffer={setEditOffer} />
        ) : (
          <AddOffer
            handleSwitch={handleSwitch}
            editOffer={editOffer}
            setEditOffer={setEditOffer}
          />
        )}
      </div>
    </div>
  );
};

export default Offers;

const OffersList = ({ handleSwitch, setEditOffer }) => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/offers")
      .then((response) => setOffers(response.data))
      .catch((error) => console.error("Error fetching offers:", error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/api/offers/${id}`)
      .then(() => setOffers(offers.filter((offer) => offer.id !== id)))
      .catch((error) => console.error("Error deleting offer:", error));
  };

  const handleEdit = (offer) => {
    setEditOffer(offer);
    handleSwitch("add");
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
        Offers
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border p-3">Background</th>
              <th className="border p-3">Min Amount</th>
              <th className="border p-3">Offer %</th>
              <th className="border p-3">Coupon</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="text-center hover:bg-gray-50">
                <td className="border p-3">
                  {offer.background_image ? (
                    <img
                      src={`http://localhost:3001/${offer.background_image}`}
                      alt="Background"
                      className="h-16 w-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border p-3">{offer.min_amount}</td>
                <td className="border p-3">{offer.offer_percentage}</td>
                <td className="border p-3">{offer.coupon_code}</td>
                <td className="border p-3">
                  {offer.isActive}
                </td>
                <td className="border p-3 space-x-2">
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all">
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(offer)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all">
                    Update
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

const AddOffer = ({ handleSwitch, editOffer, setEditOffer }) => {
  const [formData, setFormData] = useState({
    background_image: "",
    min_amount: "",
    offer_percentage: "",
    coupon_code: "",
    isActive: "",
  });

  useEffect(() => {
    if (editOffer) {
      setFormData({
        background_image: `http://localhost:3001/${editOffer.background_image}`,
        min_amount: editOffer.min_amount,
        offer_percentage: editOffer.offer_percentage,
        coupon_code: editOffer.coupon_code,
        isActive: editOffer.isActive,
      });
    }
  }, [editOffer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, background_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      if (editOffer) {
        await axios.put(
          `http://localhost:3001/api/offers/${editOffer.id}`,
          form
        );
      } else {
        await axios.post("http://localhost:3001/api/offers", form);
      }
      setEditOffer(null);
      handleSwitch("list");
    } catch (error) {
      console.error("Error saving offer:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        {editOffer ? "Update Offer" : "Add Offer"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Background Image
          </label>
          {formData.background_image && (
            <div className="mb-3">
              <img
                src={formData.background_image}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Min Amount</label>
          <input
            type="number"
            name="min_amount"
            value={formData.min_amount}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Offer Percentage
          </label>
          <input
            type="number"
            name="offer_percentage"
            value={formData.offer_percentage}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Coupon Code</label>
          <input
            type="text"
            name="coupon_code"
            value={formData.coupon_code}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Active</label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded">
            <option value="Yes">Active</option>
            <option value="No">Inactive</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => handleSwitch("list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
