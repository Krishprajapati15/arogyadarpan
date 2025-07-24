"use client";
import { useEffect, useState } from "react";
import { Mic, MicOff, Heart, Phone, PhoneOff, Loader2 } from "lucide-react";

export default function OncoSathi() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vapi, setVapi] = useState(null);

  useEffect(() => {
    // Dynamically import Vapi to avoid SSR issues
    const initVapi = async () => {
      try {
        const { default: Vapi } = await import("@vapi-ai/web");
        const vapiInstance = new Vapi("eaca5422-eca6-4653-92fc-8ec899e6cebf");
        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
          console.log("Call Started");
          setIsCallActive(true);
          setLoading(false);
        });

        vapiInstance.on("call-end", () => {
          console.log("Call Ended");
          setIsCallActive(false);
          setLoading(false);
        });

        vapiInstance.on("speech-start", () => {
          console.log("Assistant is speaking...");
        });

        vapiInstance.on("speech-end", () => {
          console.log("Assistant finished speaking.");
        });

        vapiInstance.on("message", (msg) => {
          if (msg.type !== "transcript") return;

          if (msg.transcriptType === "partial") {
            console.log("Partial transcript:", msg.text);
          }

          if (msg.transcriptType === "final") {
            console.log("Final transcript:", msg.text);
          }
        });

        vapiInstance.on("message", (msg) => {
          if (msg.type !== "function-call") return;

          if (msg.functionCall.name === "addTopping") {
            const topping = msg.functionCall.parameters.topping;
            console.log("Add topping:", topping);
          }

          if (msg.functionCall.name === "goToCheckout") {
            console.log("Redirecting to checkout...");
          }
        });
      } catch (error) {
        console.error("Failed to initialize Vapi:", error);
      }
    };

    initVapi();
  }, []);

  const handleStartCall = async () => {
    if (!vapi || loading) return;

    setLoading(true);
    try {
      const assistantId = "402a9beb-2160-4967-9bb2-a69e09ebadbc";
      await vapi.start(assistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
      setLoading(false);
    }
  };

  const handleStopCall = async () => {
    if (!vapi || loading) return;

    setLoading(true);
    try {
      await vapi.stop();
    } catch (error) {
      console.error("Failed to stop call:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="border-2 border-pink-500/20 hover:border-pink-500/60 cursor-pointer transition-all duration-300 rounded-lg bg-gray-800/50 backdrop-blur-sm shadow-2xl">
          <div className="pt-8 pb-8 px-6 flex flex-col items-center text-center">
            {/* Icon Container */}
            <div className="p-4 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 rounded-full mb-6 shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              OncoSathi
            </h2>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your caring voice companion for cancer support. Get guidance on
              symptoms, treatments, prevention tips, and emotional support
              whenever you need it.
            </p>

            {/* Call Status Indicator */}
            {isCallActive && (
              <div className="flex items-center gap-2 mb-4 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Call Active</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              {!isCallActive ? (
                <button
                  onClick={handleStartCall}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="h-5 w-5" />
                      Start Call
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleStopCall}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    <>
                      <PhoneOff className="h-5 w-5" />
                      End Call
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Features List */}
            <div className="mt-6 text-left w-full">
              <p className="text-sm text-gray-400 mb-3 text-center">
                OncoSathi can help with:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span>Cancer types info</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span>Prevention tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span>Early symptoms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span>Mental support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span>Treatment options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span>Hospital locator</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Always consult with healthcare professionals for medical advice
        </p>
      </div>
    </div>
  );
}
