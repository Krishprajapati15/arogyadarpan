import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  ExternalLink,
} from "lucide-react";

const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [currentLocation, setCurrentLocation] = useState(
    "Gandhinagar, Gujarat, India"
  );
  const [error, setError] = useState("");

  // Load nearby hospitals on component mount
  useEffect(() => {
    fetchHospitals(currentLocation);
  }, []);

  const fetchHospitals = async (location) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }

      const data = await response.json();
      setHospitals(data.hospitals || []);
    } catch (err) {
      setError("Failed to load hospitals. Please try again.");
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;

    const location = `${searchCity.trim()}, India`;
    setCurrentLocation(location);
    await fetchHospitals(location);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = `${latitude},${longitude}`;
          setCurrentLocation("Your Current Location");
          await fetchHospitals(location);
        },
        (error) => {
          setError("Unable to get your location. Please search manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const formatRating = (rating) => {
    return rating ? parseFloat(rating).toFixed(1) : "N/A";
  };

  const formatReviews = (reviews) => {
    if (!reviews) return "";
    if (reviews >= 1000) {
      return `(${(reviews / 1000).toFixed(1)}k)`;
    }
    return `(${reviews})`;
  };

  return (
    <div className="hospital-finder-container">
      <div className="hospital-finder-wrapper">
        {/* Header */}
        <div className="hospital-finder-header">
          <h2 className="hospital-finder-title">Hospital Finder</h2>
          <p className="hospital-finder-subtitle">
            Find nearby hospitals and medical facilities
          </p>
        </div>

        {/* Search Form */}
        <div className="hospital-finder-search-container">
          <form onSubmit={handleSearch} className="hospital-finder-search-form">
            <div className="hospital-finder-search-wrapper">
              <div className="hospital-finder-input-wrapper">
                <Search className="hospital-finder-search-icon" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
                  className="hospital-finder-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="hospital-finder-search-btn"
              >
                {loading ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                className="hospital-finder-location-btn"
                title="Use current location"
              >
                <Navigation className="hospital-finder-nav-icon" />
              </button>
            </div>
          </form>
        </div>

        {/* Current Location Display */}
        <div className="hospital-finder-location-display">
          <div className="hospital-finder-location-badge">
            <MapPin className="hospital-finder-location-pin" />
            <span>Showing results for: {currentLocation}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="hospital-finder-error">
            <div className="hospital-finder-error-content">{error}</div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="hospital-finder-loading">
            <div className="hospital-finder-spinner"></div>
          </div>
        )}

        {/* Hospital Results */}
        {!loading && hospitals.length > 0 && (
          <div className="hospital-finder-grid">
            {hospitals.map((hospital, index) => (
              <div key={index} className="hospital-finder-card">
                {/* Hospital Title */}
                <h3 className="hospital-finder-card-title">{hospital.title}</h3>

                {/* Rating and Reviews */}
                {hospital.rating && (
                  <div className="hospital-finder-rating">
                    <div className="hospital-finder-rating-stars">
                      <Star className="hospital-finder-star" />
                      <span className="hospital-finder-rating-value">
                        {formatRating(hospital.rating)}
                      </span>
                    </div>
                    {hospital.reviews && (
                      <span className="hospital-finder-reviews">
                        {formatReviews(hospital.reviews)} reviews
                      </span>
                    )}
                  </div>
                )}

                {/* Hospital Type */}
                {hospital.type && (
                  <div className="hospital-finder-type">
                    <span className="hospital-finder-type-badge">
                      {hospital.type}
                    </span>
                  </div>
                )}

                {/* Address */}
                {hospital.address && (
                  <div className="hospital-finder-address">
                    <MapPin className="hospital-finder-address-icon" />
                    <p className="hospital-finder-address-text">
                      {hospital.address}
                    </p>
                  </div>
                )}

                {/* Phone */}
                {hospital.phone && (
                  <div className="hospital-finder-phone">
                    <Phone className="hospital-finder-phone-icon" />
                    <a
                      href={`tel:${hospital.phone}`}
                      className="hospital-finder-phone-link"
                    >
                      {hospital.phone}
                    </a>
                  </div>
                )}

                {/* Hours */}
                {hospital.hours && (
                  <div className="hospital-finder-hours">
                    <Clock className="hospital-finder-hours-icon" />
                    <span className="hospital-finder-hours-text">
                      {hospital.hours}
                    </span>
                  </div>
                )}

                {/* Service Options */}
                {hospital.service_options &&
                  Object.keys(hospital.service_options).length > 0 && (
                    <div className="hospital-finder-services">
                      <p className="hospital-finder-services-label">
                        Services:
                      </p>
                      <div className="hospital-finder-services-tags">
                        {Object.entries(hospital.service_options).map(
                          ([key, value]) =>
                            value && (
                              <span
                                key={key}
                                className="hospital-finder-service-tag"
                              >
                                {key.replace(/_/g, " ")}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="hospital-finder-actions">
                  {hospital.links?.website && (
                    <a
                      href={hospital.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hospital-finder-website-btn"
                    >
                      <ExternalLink className="hospital-finder-btn-icon" />
                      Website
                    </a>
                  )}
                  {hospital.links?.directions && (
                    <a
                      href={hospital.links.directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hospital-finder-directions-btn"
                    >
                      <Navigation className="hospital-finder-btn-icon" />
                      Directions
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && hospitals.length === 0 && !error && (
          <div className="hospital-finder-no-results">
            <div className="hospital-finder-no-results-content">
              <MapPin className="hospital-finder-no-results-icon" />
              <h3 className="hospital-finder-no-results-title">
                No hospitals found
              </h3>
              <p className="hospital-finder-no-results-text">
                Try searching for a different city or check your spelling.
              </p>
              <button
                onClick={() => fetchHospitals("Mumbai, Maharashtra, India")}
                className="hospital-finder-try-btn"
              >
                Try Mumbai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
