"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MapPin,
  Bot,
  User,
  Loader,
  Phone,
  Navigation,
  Clock,
  X,
} from "lucide-react";

const HospitalChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I can help you find hospitals anywhere. Just ask me something like 'Show me hospitals in Palanpur' or 'Find hospitals near Mumbai'.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState(null);
  const messagesEndRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize map when map data is available
  useEffect(() => {
    if (showMap && mapData && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [showMap, mapData]);

  const initializeMap = () => {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = createMap;
      document.body.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    if (mapRef.current && window.L && !mapInstanceRef.current && mapData) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        [mapData.center.lat, mapData.center.lng],
        12
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      // Add hospital markers
      mapData.hospitals.forEach((hospital) => {
        const hospitalIcon = window.L.divIcon({
          className: "hospital-marker",
          html: `<div style="background: #EF4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);">+</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = window.L.marker([hospital.lat, hospital.lng], {
          icon: hospitalIcon,
        }).addTo(mapInstanceRef.current).bindPopup(`
            <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${
                hospital.name
              }</h3>
              ${
                hospital.address
                  ? `<p style="margin: 6px 0; font-size: 14px; color: #6b7280; line-height: 1.4;"><strong>Address:</strong> ${hospital.address}</p>`
                  : ""
              }
              ${
                hospital.phone
                  ? `<p style="margin: 6px 0; font-size: 14px; color: #6b7280;"><strong>Phone:</strong> <a href="tel:${hospital.phone}" style="color: #059669; text-decoration: none;">${hospital.phone}</a></p>`
                  : ""
              }
              ${
                hospital.opening_hours
                  ? `<p style="margin: 6px 0; font-size: 14px; color: #6b7280;"><strong>Hours:</strong> ${hospital.opening_hours}</p>`
                  : ""
              }
              ${
                hospital.emergency
                  ? `<p style="margin: 6px 0; font-size: 14px; color: #dc2626;"><strong>Emergency:</strong> ${hospital.emergency}</p>`
                  : ""
              }
              <div style="margin-top: 12px; display: flex; gap: 8px;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${
                  hospital.lat
                },${hospital.lng}" 
                   target="_blank" 
                   style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                  🧭 Directions
                </a>
                ${
                  hospital.phone
                    ? `<a href="tel:${hospital.phone}" style="background: #059669; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">📞 Call</a>`
                    : ""
                }
              </div>
            </div>
          `);
      });

      // Add center marker
      const centerIcon = window.L.divIcon({
        className: "center-marker",
        html: `<div style="background: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      window.L.marker([mapData.center.lat, mapData.center.lng], {
        icon: centerIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<strong>${mapData.location}</strong><br/>Search Center`);
    }
  };

  const extractLocationFromQuery = (query) => {
    const lowerQuery = query.toLowerCase();

    // Common patterns to extract location
    const patterns = [
      /(?:show|find|search|get|locate).*?hospitals?\s+(?:in|near|at|around)\s+([^.!?]+)/i,
      /hospitals?\s+(?:in|near|at|around)\s+([^.!?]+)/i,
      /(?:in|near|at|around)\s+([^.!?]+)\s+hospitals?/i,
      /([a-zA-Z\s,]+)\s+hospitals?/i,
    ];

    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/[^\w\s,.-]/g, "");
      }
    }

    return null;
  };

  const geocodeLocation = async (locationName) => {
    try {
      // Use Nominatim (OpenStreetMap) for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          displayName: result.display_name,
          found: true,
        };
      }
      return { found: false };
    } catch (error) {
      console.error("Geocoding error:", error);
      return { found: false };
    }
  };

  const fetchHospitalsForLocation = async (lat, lng, locationName) => {
    try {
      const radius = 10000; // 10km radius

      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
        );
        out center meta;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: overpassQuery,
      });

      if (!response.ok) throw new Error("Failed to fetch hospital data");

      const data = await response.json();

      const hospitals = data.elements
        .map((element) => {
          let hospitalLat, hospitalLng;
          if (element.type === "node") {
            hospitalLat = element.lat;
            hospitalLng = element.lon;
          } else if (element.center) {
            hospitalLat = element.center.lat;
            hospitalLng = element.center.lon;
          } else {
            return null;
          }

          const distance = calculateDistance(
            lat,
            lng,
            hospitalLat,
            hospitalLng
          );

          return {
            id: element.id,
            name: element.tags?.name || "Hospital",
            lat: hospitalLat,
            lng: hospitalLng,
            distance: distance.toFixed(2),
            phone: element.tags?.phone || "",
            website: element.tags?.website || "",
            emergency: element.tags?.emergency || "",
            opening_hours: element.tags?.opening_hours || "",
            operator: element.tags?.operator || "",
            address:
              element.tags?.["addr:full"] ||
              `${element.tags?.["addr:street"] || ""} ${
                element.tags?.["addr:city"] || ""
              }`.trim() ||
              element.tags?.["addr:housename"] ||
              "",
            healthcare: element.tags?.healthcare || "",
            beds: element.tags?.beds || "",
          };
        })
        .filter(Boolean)
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      return {
        hospitals,
        center: { lat, lng },
        location: locationName,
      };
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      throw new Error("Failed to fetch hospital data");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const location = extractLocationFromQuery(inputText);

      if (!location) {
        const botMessage = {
          id: messages.length + 2,
          type: "bot",
          text: "I couldn't identify a location in your message. Please try asking like 'Show me hospitals in Palanpur' or 'Find hospitals near Mumbai'.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // Geocode the location
      const geoResult = await geocodeLocation(location);

      if (!geoResult.found) {
        const botMessage = {
          id: messages.length + 2,
          type: "bot",
          text: `I couldn't find the location "${location}". Please check the spelling or try a different location name.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // Fetch hospitals
      const hospitalData = await fetchHospitalsForLocation(
        geoResult.lat,
        geoResult.lng,
        location
      );

      if (hospitalData.hospitals.length === 0) {
        const botMessage = {
          id: messages.length + 2,
          type: "bot",
          text: `I couldn't find any hospitals in ${location}. Try expanding your search to nearby cities.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // Set map data and show map
      setMapData(hospitalData);
      setShowMap(true);

      // Reset map instance to force recreation
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: `Found ${hospitalData.hospitals.length} hospitals in ${location}! Check out the map and list below. You can click on map markers for details or get directions.`,
        timestamp: new Date(),
        hasMap: true,
        hospitalData,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: "Sorry, I encountered an error while searching for hospitals. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const closeMap = () => {
    setShowMap(false);
    setMapData(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 mt-16 mb-10">
      {/* Chat Section */}
      <div
        className={`${
          showMap ? "w-1/2" : "w-full"
        } flex flex-col bg-black transition-all duration-300`}
      >
        {/* Header */}
        <div className="bg-teal-400 text-white p-4 flex items-center gap-3">
          <div className="bg-teal-700 p-2 rounded-full">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Hospital Finder Bot</h1>
            <p className="text-blue-100 text-sm">
              Ask me to find hospitals anywhere!
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg flex items-start gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.type === "user" ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-700" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.hasMap && message.hospitalData && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="space-y-2">
                        {message.hospitalData.hospitals
                          .slice(0, 3)
                          .map((hospital) => (
                            <div
                              key={hospital.id}
                              className="bg-gray-800 p-3 rounded-lg text-gray-800"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-sm">
                                  {hospital.name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {hospital.distance} km
                                </span>
                              </div>
                              {hospital.address && (
                                <p className="text-xs text-gray-600 mb-2">
                                  {hospital.address}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-600"
                                >
                                  <Navigation className="w-3 h-3" />
                                  Directions
                                </a>
                                {hospital.phone && (
                                  <a
                                    href={`tel:${hospital.phone}`}
                                    className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-green-600"
                                  >
                                    <Phone className="w-3 h-3" />
                                    Call
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        {message.hospitalData.hospitals.length > 3 && (
                          <p className="text-xs text-gray-600">
                            And {message.hospitalData.hospitals.length - 3} more
                            hospitals shown on map...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-300">
                  <Bot className="w-4 h-4 text-gray-700" />
                </div>
                <div className="bg-gray-200 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">
                    Searching for hospitals...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to find hospitals... e.g., 'Show me hospitals in Palanpur'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick examples */}
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              "Show hospitals in Mumbai",
              "Find hospitals near Delhi",
              "Hospitals in Bangalore",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInputText(example)}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      {showMap && mapData && (
        <div className="w-1/2 bg-white border-l flex flex-col">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                Hospitals in {mapData.location}
              </h2>
              <p className="text-sm text-gray-600">
                {mapData.hospitals.length} hospitals found
              </p>
            </div>
            <button
              onClick={closeMap}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalChatbot;
