"use client";

import { useState, useEffect } from "react";
import {
  sendMedicineReminder,
  getUserReminders,
  updateReminderStatus,
  deleteReminder,
} from "../actions/medicineReminderAction";
import { ColourfulText } from "./ui/colourful-text";

export default function MedicineReminder() {
  const [formData, setFormData] = useState({
    medicineName: "",
    email: "",
    reminderType: "always",
    time: "",
    specificDate: "",
    specificDay: "",
    dosage: "",
    instructions: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'manage'
  const [existingReminders, setExistingReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await sendMedicineReminder(formData);
      if (result.success) {
        setMessage(
          "Medicine reminder set successfully! You will receive email notifications as scheduled."
        );
        // Reset form
        setFormData({
          medicineName: "",
          email: "",
          reminderType: "always",
          time: "",
          specificDate: "",
          specificDay: "",
          dosage: "",
          instructions: "",
        });
        // Refresh reminders list if viewing manage tab
        if (activeTab === "manage" && userEmail) {
          loadUserReminders(userEmail);
        }
      } else {
        setMessage(result.error || "Failed to set reminder. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserReminders = async (email) => {
    if (!email) return;

    setLoadingReminders(true);
    try {
      const result = await getUserReminders(email);
      if (result.success) {
        setExistingReminders(result.reminders);
      }
    } catch (error) {
      console.error("Error loading reminders:", error);
    } finally {
      setLoadingReminders(false);
    }
  };

  const handleToggleReminder = async (reminderId, currentStatus) => {
    try {
      const result = await updateReminderStatus(reminderId, !currentStatus);
      if (result.success) {
        setExistingReminders((prev) =>
          prev.map((reminder) =>
            reminder.id === reminderId
              ? { ...reminder, isActive: !currentStatus }
              : reminder
          )
        );
      }
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      try {
        const result = await deleteReminder(reminderId);
        if (result.success) {
          setExistingReminders((prev) =>
            prev.filter((reminder) => reminder.id !== reminderId)
          );
        }
      } catch (error) {
        console.error("Error deleting reminder:", error);
      }
    }
  };

  const formatReminderType = (type, specificDay, specificDate) => {
    switch (type) {
      case "always":
        return "📅 Daily";
      case "specific-day":
        return `📅 Every ${
          specificDay?.charAt(0).toUpperCase() + specificDay?.slice(1)
        }`;
      case "specific-date":
        return `📅 ${new Date(specificDate).toLocaleDateString()}`;
      default:
        return type;
    }
  };

  const getReminderTypeColor = (type) => {
    switch (type) {
      case "always":
        return "bg-green-900/50 text-green-300 border-green-700";
      case "specific-day":
        return "bg-blue-900/50 text-blue-300 border-blue-700";
      case "specific-date":
        return "bg-purple-900/50 text-purple-300 border-purple-700";
      default:
        return "bg-gray-900/50 text-gray-300 border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-full mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <ColourfulText text="Medicine Reminder" />
          </h1>
          <p className="text-gray-400 text-lg">
            Never miss your medication with smart email reminders
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Create Reminder
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Manage Reminders
            </button>
          </div>
        </div>

        {/* Create Reminder Tab */}
        {activeTab === "create" && (
          <div className="bg-background backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter medicine name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 1 tablet, 5ml"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reminder Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Reminder Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reminder Type *
                </label>
                <select
                  name="reminderType"
                  value={formData.reminderType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="always">📅 Daily Reminder</option>
                  <option value="specific-day">📅 Specific Day of Week</option>
                  <option value="specific-date">📅 Specific Date</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {formData.reminderType === "specific-day" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Day of Week *
                  </label>
                  <select
                    name="specificDay"
                    value={formData.specificDay}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a day</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              )}

              {formData.reminderType === "specific-date" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Specific Date *
                  </label>
                  <input
                    type="date"
                    name="specificDate"
                    value={formData.specificDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="e.g., Take with food, After meals, etc."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Setting Reminder...
                  </div>
                ) : (
                  "💊 Set Medicine Reminder"
                )}
              </button>
            </form>

            {message && (
              <div
                className={`mt-6 p-4 rounded-lg border transition-opacity duration-500 ${
                  message.includes("successfully")
                    ? "bg-green-900/50 border-green-700 text-green-300"
                    : "bg-red-900/50 border-red-700 text-red-300"
                }`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {message.includes("successfully") ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                  {message}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manage Reminders Tab */}
        {activeTab === "manage" && (
          <div className="bg-background backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter Email to View Reminders
              </label>
              <div className="flex gap-4">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
                <button
                  onClick={() => loadUserReminders(userEmail)}
                  disabled={!userEmail || loadingReminders}
                  className="px-6 py-3 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                >
                  {loadingReminders ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Load Reminders"
                  )}
                </button>
              </div>
            </div>

            {/* Reminders List */}
            {existingReminders.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your Medicine Reminders
                </h3>
                {existingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-white/5 border border-gray-700 rounded-lg p-6  transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-white">
                            💊 {reminder.medicineName}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getReminderTypeColor(
                              reminder.reminderType
                            )}`}
                          >
                            {formatReminderType(
                              reminder.reminderType,
                              reminder.specificDay,
                              reminder.specificDate
                            )}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reminder.isActive
                                ? "bg-green-900/50 text-green-300 border border-green-700"
                                : "bg-red-900/50 text-red-300 border border-red-700"
                            }`}
                          >
                            {reminder.isActive ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>
                            <span className="text-gray-400">⏰ Time:</span>{" "}
                            {reminder.time}
                          </div>
                          {reminder.dosage && (
                            <div>
                              <span className="text-gray-400">💊 Dosage:</span>{" "}
                              {reminder.dosage}
                            </div>
                          )}
                          {reminder.instructions && (
                            <div className="md:col-span-2">
                              <span className="text-gray-400">
                                📋 Instructions:
                              </span>{" "}
                              {reminder.instructions}
                            </div>
                          )}
                          <div className="md:col-span-2 text-xs text-gray-500">
                            Created:{" "}
                            {new Date(reminder.createdAt).toLocaleDateString()}
                            {reminder.lastSent &&
                              ` • Last sent: ${new Date(
                                reminder.lastSent
                              ).toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() =>
                            handleToggleReminder(reminder.id, reminder.isActive)
                          }
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            reminder.isActive
                              ? "bg-yellow-900/50 hover:bg-yellow-900/70 text-yellow-300"
                              : "bg-green-900/50 hover:bg-green-900/70 text-green-300"
                          }`}
                        >
                          {reminder.isActive ? "Pause" : "Resume"}
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="px-3 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-sm font-medium transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userEmail && !loadingReminders ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  No reminders found
                </div>
                <p className="text-gray-500">
                  Create your first medicine reminder to get started!
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-background border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            How it works
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">
                📝 Create Reminders
              </h4>
              <ul className="space-y-1">
                <li>• Set medicine name, dosage, and timing</li>
                <li>• Choose daily, weekly, or one-time reminders</li>
                <li>• Add custom instructions for each medicine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                📧 Receive Notifications
              </h4>
              <ul className="space-y-1">
                <li>• Beautiful email reminders at scheduled times</li>
                <li>• Professional formatting with all details</li>
                <li>• Never miss your medication schedule</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
