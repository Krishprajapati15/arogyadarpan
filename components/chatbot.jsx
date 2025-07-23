"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  Image,
  Volume2,
  VolumeX,
  User,
  Bot,
} from "lucide-react";
import { readStreamableValue } from "ai/rsc";
import { continueConversation } from "@/actions/actions";
// Adjust the import path as needed

const NVIDIAChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sendMessage = async (messageText, imageData = null) => {
    if (!messageText.trim() && !imageData) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageText,
      image: imageData,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      // Create the bot message placeholder
      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        type: "bot",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Prepare messages for the AI API
      const conversationMessages = messages.map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      // Add the new user message
      conversationMessages.push({
        role: "user",
        content: messageText || "Please describe this image.",
      });

      // Call the server action
      const stream = await continueConversation(conversationMessages);

      // Stream the response
      let fullResponse = "";
      for await (const delta of readStreamableValue(stream)) {
        if (delta) {
          fullResponse += delta;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, content: fullResponse } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);

      let errorMessage =
        "Sorry, I encountered an error while processing your request.";

      if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: Unable to connect to the server. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      const errorMessageObj = {
        id: Date.now() + 2,
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue, selectedImage);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        // Convert speech to text (you'd need to implement this with a speech-to-text service)
        // For now, we'll just show a placeholder
        setInputValue(
          "Voice input received (speech-to-text integration needed)"
        );
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <h1 className="text-xl font-semibold text-white">
          NVIDIA NIM Assistant
        </h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Welcome to NVIDIA NIM Assistant</p>
            <p className="text-sm">
              Start a conversation by typing a message, uploading an image, or
              using voice input.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              } items-start gap-3`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "user" ? "bg-blue-600" : "bg-gray-800"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              <div
                className={`rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 border border-gray-800"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="max-w-xs rounded-lg mb-2"
                  />
                )}

                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.type === "bot" && (
                    <button
                      onClick={() => speakText(message.content)}
                      className={`p-1 rounded hover:bg-gray-800 transition-colors flex-shrink-0 ${
                        isSpeaking ? "text-blue-400" : "text-gray-500"
                      }`}
                      title={isSpeaking ? "Stop speaking" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-600 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        {imagePreview && (
          <div className="mb-4 relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-32 h-20 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputValue, selectedImage);
                }
              }}
            />

            <div className="absolute right-2 bottom-2 flex gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Upload image"
              >
                <Image className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording
                    ? "text-red-400 hover:text-red-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-white hover:bg-gray-700"
                }`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => sendMessage(inputValue, selectedImage)}
            disabled={(!inputValue.trim() && !selectedImage) || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NVIDIAChatbot;
