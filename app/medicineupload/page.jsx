"use client";

import React, { useState, useRef, useEffect } from "react";

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Custom Icons (replacing @tabler/icons-react)
const IconUpload = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const IconX = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const IconSend = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const IconBot = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const IconUser = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const IconPhoto = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const IconSparkles = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3l3.057 6H15l3.057-6M5 3L2 9l3.057 6H15L18 9l-3-6M5 3h10M9 21v-4m0 0V9m0 8h6"
    />
  </svg>
);

const IconArrowLeft = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

// GridPattern component
function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] transition-all duration-300 ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

// File Upload Component (custom drag & drop implementation)
const FileUpload = ({ onChange, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    const validFiles = Array.from(newFiles).filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    onChange && onChange([...files, ...validFiles]);
  };

  const handleFileRemove = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onChange && onChange(updatedFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileChange(droppedFiles);
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-10 group/file block rounded-lg cursor-pointer w-full mb-6 relative overflow-hidden transition-all duration-300 ${
          isHovered ? "transform scale-[1.02]" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload Image of Medicine or Prescription
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload Image of Medicine
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <div
                  key={"file" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md transition-all duration-300",
                    "shadow-sm hover:shadow-md"
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileRemove(idx);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors z-50"
                  >
                    <IconX className="h-4 w-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200" />
                  </button>

                  <div className="flex justify-between w-full items-center gap-4 pr-8">
                    <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800">
                      {file.type}
                    </p>
                    <p>
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            {!files.length && (
              <div
                className={cn(
                  "relative z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md transition-all duration-300",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                  isHovered
                    ? "shadow-2xl transform translate-x-5 -translate-y-5 opacity-90"
                    : ""
                )}
              >
                {isDragActive ? (
                  <p className="text-neutral-600 flex flex-col items-center animate-pulse">
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400 mt-1" />
                  </p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </div>
            )}

            {!files.length && (
              <div className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md transition-opacity duration-300 group-hover/file:opacity-100"></div>
            )}
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex justify-center animate-fadeIn">
          <button
            onClick={() => onUpload && onUpload(files)}
            className=" bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600  text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 "
          >
            <IconSparkles className="h-5 w-5 " />
            Analyze with AI
          </button>
        </div>
      )}
    </div>
  );
};

// Chatbot Component
const MedicineChatbot = ({ uploadedFiles, onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I can help analyze your medicine or prescription. I can identify medications, explain their uses, dosages, side effects, and answer any questions you have about them.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock Gemini API call (replace with actual API integration)
  const callGeminiAPI = async (message, imageData = null) => {
    // Replace this with actual Gemini API integration
    // For demo purposes, using a mock response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (imageData) {
      return "I can see your uploaded image. This appears to be a medicine/prescription. I can help identify the medication, explain its uses, dosage instructions, potential side effects, and answer any questions you have about it. Please ask me anything specific you'd like to know!";
    }

    // Mock responses based on common medicine queries
    const responses = [
      "Based on the image you uploaded, I can help you understand the medication details. What specific information would you like to know?",
      "I can assist with identifying the medicine, its dosage, side effects, and usage instructions. Feel free to ask any specific questions!",
      "This medication information can help you understand proper usage and precautions. What would you like to know more about?",
      "I'm here to help explain any medical information from your uploaded image. Please ask me anything you need to know!",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage || "Uploaded image for analysis",
      timestamp: new Date(),
      hasImage: uploadedFiles.length > 0,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const imageData = uploadedFiles.length > 0 ? uploadedFiles[0] : null;
      const response = await callGeminiAPI(inputMessage, imageData);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-slideIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
            <IconBot className="h-8 w-8" />
            <div>
              <h3 className="font-bold text-lg">Medicine AI Assistant</h3>
              <p className="text-sm opacity-90">
                Your personal medicine advisor
              </p>
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <IconPhoto className="h-4 w-4" />
              <span className="text-sm">
                {uploadedFiles.length} image uploaded
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-800">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-messageSlide ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.type === "bot" && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <IconBot className="h-4 w-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-md ${
                message.type === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              }`}
            >
              {message.hasImage && (
                <div className="mb-2 p-2 bg-white/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <IconPhoto className="h-4 w-4" />
                    <span>Medicine image uploaded</span>
                  </div>
                </div>
              )}
              <p
                className={`text-sm ${
                  message.type === "user"
                    ? "text-white"
                    : "text-neutral-700 dark:text-neutral-200"
                }`}
              >
                {message.content}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.type === "user"
                    ? "text-white/70"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <IconUser className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <IconBot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about the medicine, dosage, side effects..."
              className="w-full p-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-lg resize-none bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows="1"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() && uploadedFiles.length === 0}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            <IconSend className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setInputMessage("What is this medicine used for?")}
            className="text-sm px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors transform hover:scale-105"
          >
            What is this medicine?
          </button>
          <button
            onClick={() => setInputMessage("What are the side effects?")}
            className="text-sm px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors transform hover:scale-105"
          >
            Side effects?
          </button>
          <button
            onClick={() => setInputMessage("How should I take this medicine?")}
            className="text-sm px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors transform hover:scale-105"
          >
            Dosage instructions?
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function MedicineUploadPage() {
  const [files, setFiles] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
  };

  const handleUploadClick = (uploadedFiles) => {
    setFiles(uploadedFiles);
    setShowChatbot(true);
  };

  const handleBackToUpload = () => {
    setShowChatbot(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-4 mt-20">
      <div className="w-full max-w-5xl mx-auto py-8">
        {!showChatbot ? (
          <div className="border border-dashed bg-white/80 dark:bg-black/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg animate-fadeIn">
            <div className="text-center mb-8 pt-8">
              <h1 className="text-4xl font-bold  bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-4">
                Medicine AI Assistant
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                Upload your medicine or prescription image and get instant
                AI-powered analysis
              </p>
            </div>
            <FileUpload
              onChange={handleFileUpload}
              onUpload={handleUploadClick}
            />
          </div>
        ) : (
          <div className="animate-slideIn">
            <MedicineChatbot
              uploadedFiles={files}
              onBack={handleBackToUpload}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-messageSlide {
          animation: messageSlide 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
