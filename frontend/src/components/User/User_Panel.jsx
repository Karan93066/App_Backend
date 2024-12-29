import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
function UserPanel() {
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };
  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/packages");
      const data = await res.json();
      // Filter only active packages
      setPackages(data.filter((pkg) => pkg.isActive === "1"));
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/offers")
      .then((response) => {
        // Filter only active offers
        setOffers(response.data.filter((offer) => offer.isActive === "Yes"));
      })
      .catch((error) => console.error("Error fetching offers:", error));

    fetchPackages();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-700 min-h-screen py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-wide mb-4">
            Welcome to the User Panel
          </h1>
          <p className="text-lg text-gray-200">
            Explore our exclusive offers and packages tailored just for you!
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded">
            Logout
          </button>
        </header>

        {/* Offers Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Exclusive Offers
          </h2>
          {offers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative bg-cover bg-center rounded-lg shadow-lg p-6 overflow-hidden transition-transform transform hover:scale-105"
                  style={{
                    backgroundImage: `url(${`http://localhost:3001/${offer.background_image}`})`,
                  }}>
                  <div className="bg-black bg-opacity-60 rounded-lg p-4">
                    <h3 className="text-2xl font-bold mb-2">
                      Coupon Code:{" "}
                      <span className="text-yellow-400">
                        {offer.coupon_code}
                      </span>
                    </h3>
                    <p className="text-lg">
                      Offer: {offer.offer_percentage}% Off
                    </p>
                    <p>Minimum Spend: ₹{offer.min_amount}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-50 transition-opacity"></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300">
              No active offers available.
            </p>
          )}
        </section>

        {/* Packages Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-6">Our Packages</h2>
          {packages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                  style={{
                    backgroundImage: `url(${`http://localhost:3001/${pkg.background_image}`})`,
                  }}>
                  <div className="bg-black bg-opacity-60 rounded-lg p-4">
                    <h3 className="text-2xl font-bold mb-2">
                      Package {pkg.id}
                    </h3>
                    <p className="text-lg">
                      Price:{" "}
                      <span className="line-through text-gray-300">
                        ₹{pkg.mrp}
                      </span>{" "}
                      <span className="text-yellow-400">
                        ₹{pkg.actual_price}
                      </span>
                    </p>
                    <p>Discount: {pkg.discount_percentage}%</p>
                    <p>Validity: {pkg.days} days</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-50 transition-opacity"></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300">
              No active packages available.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserPanel;
