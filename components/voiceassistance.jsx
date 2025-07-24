"use client";
import { useEffect, useState } from "react";
import {
  Heart,
  Droplets,
  HeartHandshake,
  Brain,
  User,
  Shield,
  Phone,
  PhoneOff,
  Loader2,
} from "lucide-react";

export default function HealthAssistantsDashboard() {
  const [callStates, setCallStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [vapiInstances, setVapiInstances] = useState({});

  const assistants = [
    {
      id: "oncosathi",
      name: "OncoSathi",
      description:
        "Your caring voice companion for cancer support. Get guidance on symptoms, treatments, prevention tips, and emotional support whenever you need it.",
      assistantId: "402a9beb-2160-4967-9bb2-a69e09ebadbc",
      icon: Heart,
      gradient: "from-pink-400 via-rose-500 to-pink-600",
      borderColor: "border-pink-500/20 hover:border-pink-500/60",
      shadowColor: "hover:shadow-pink-500/25",
      features: [
        "Cancer types info",
        "Prevention tips",
        "Early symptoms",
        "Mental support",
        "Treatment options",
        "Hospital locator",
      ],
    },
    {
      id: "sugarsaathi",
      name: "SugarSaathi",
      description:
        "Your trusted diabetes companion for managing blood sugar levels, diet planning, and medication reminders with personalized Indian diet suggestions.",
      assistantId: "38041083-834d-442a-8234-f32781348d61",
      icon: Droplets,
      gradient: "from-blue-400 via-cyan-500 to-blue-600",
      borderColor: "border-blue-500/20 hover:border-blue-500/60",
      shadowColor: "hover:shadow-blue-500/25",
      features: [
        "Diet plans",
        "Sugar level tips",
        "Symptoms tracking",
        "Medication reminders",
        "Indian diet suggestions",
        "Myths vs facts",
      ],
    },
    {
      id: "hearthelp",
      name: "HeartHelp",
      description:
        "Your heart health guardian providing guidance on recognizing heart attack signs, daily cardio tips, and blood pressure management support.",
      assistantId: "1f4b0f37-32de-407b-ae7c-40ef2e47335c",
      icon: HeartHandshake,
      gradient: "from-red-400 via-rose-500 to-red-600",
      borderColor: "border-red-500/20 hover:border-red-500/60",
      shadowColor: "hover:shadow-red-500/25",
      features: [
        "Heart attack signs",
        "Daily cardio tips",
        "Stress reduction",
        "Blood pressure help",
        "Women's symptoms",
        "Emergency guidance",
      ],
    },
    {
      id: "mannsaathi",
      name: "MannSaathi",
      description:
        "Your mental wellness companion offering support for depression, anxiety, guided breathing techniques, and emotional well-being guidance.",
      assistantId: "6850ff33-c9f6-4a6f-90a2-5742b94a96e6",
      icon: Brain,
      gradient: "from-purple-400 via-violet-500 to-purple-600",
      borderColor: "border-purple-500/20 hover:border-purple-500/60",
      shadowColor: "hover:shadow-purple-500/25",
      features: [
        "Depression support",
        "Anxiety help",
        "Therapy FAQs",
        "Breathing techniques",
        "Emotional support",
        "Crisis helpline info",
      ],
    },
    {
      id: "naricare",
      name: "NariCare",
      description:
        "Your women's health companion providing privacy-focused guidance on periods, PCOS, pregnancy, menopause, and breastfeeding support.",
      assistantId: "250fca16-36f3-4015-a205-66122cbd90bc",
      icon: User,
      gradient: "from-emerald-400 via-teal-500 to-emerald-600",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/60",
      shadowColor: "hover:shadow-emerald-500/25",
      features: [
        "Period tracking",
        "PCOS info",
        "Pregnancy FAQs",
        "Menopause education",
        "Breastfeeding tips",
        "Privacy focused",
      ],
    },
    {
      id: "jeevansaathi",
      name: "JeevanSaathi",
      description:
        "Your liver and kidney health specialist providing guidance on cirrhosis, hepatitis, dialysis support, and medical report explanations.",
      assistantId: "8c63e967-e857-461d-9093-48d0f6418d2b",
      icon: Shield,
      gradient: "from-orange-400 via-amber-500 to-orange-600",
      borderColor: "border-orange-500/20 hover:border-orange-500/60",
      shadowColor: "hover:shadow-orange-500/25",
      features: [
        "Cirrhosis info",
        "Hepatitis guidance",
        "Dialysis support",
        "Report explanations",
        "SGPT/Creatinine",
        "Symptom guidance",
      ],
    },
  ];

  useEffect(() => {
    const initializeVapi = async () => {
      try {
        const { default: Vapi } = await import("@vapi-ai/web");
        const instances = {};

        assistants.forEach((assistant) => {
          const vapiInstance = new Vapi("eaca5422-eca6-4653-92fc-8ec899e6cebf");

          vapiInstance.on("call-start", () => {
            console.log(`${assistant.name} Call Started`);
            setCallStates((prev) => ({ ...prev, [assistant.id]: true }));
            setLoadingStates((prev) => ({ ...prev, [assistant.id]: false }));
          });

          vapiInstance.on("call-end", () => {
            console.log(`${assistant.name} Call Ended`);
            setCallStates((prev) => ({ ...prev, [assistant.id]: false }));
            setLoadingStates((prev) => ({ ...prev, [assistant.id]: false }));
          });

          vapiInstance.on("speech-start", () => {
            console.log(`${assistant.name} Assistant is speaking...`);
          });

          vapiInstance.on("speech-end", () => {
            console.log(`${assistant.name} Assistant finished speaking.`);
          });

          vapiInstance.on("message", (msg) => {
            if (msg.type !== "transcript") return;

            if (msg.transcriptType === "partial") {
              console.log(`${assistant.name} Partial transcript:`, msg.text);
            }

            if (msg.transcriptType === "final") {
              console.log(`${assistant.name} Final transcript:`, msg.text);
            }
          });

          vapiInstance.on("message", (msg) => {
            if (msg.type !== "function-call") return;

            if (msg.functionCall.name === "addTopping") {
              const topping = msg.functionCall.parameters.topping;
              console.log(`${assistant.name} Add topping:`, topping);
            }

            if (msg.functionCall.name === "goToCheckout") {
              console.log(`${assistant.name} Redirecting to checkout...`);
            }
          });

          instances[assistant.id] = vapiInstance;
        });

        setVapiInstances(instances);
      } catch (error) {
        console.error("Failed to initialize Vapi:", error);
      }
    };

    initializeVapi();
  }, []);

  const handleStartCall = async (assistantId, vapiAssistantId) => {
    const vapi = vapiInstances[assistantId];
    if (!vapi || loadingStates[assistantId]) return;

    setLoadingStates((prev) => ({ ...prev, [assistantId]: true }));
    try {
      await vapi.start(vapiAssistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
      setLoadingStates((prev) => ({ ...prev, [assistantId]: false }));
    }
  };

  const handleStopCall = async (assistantId) => {
    const vapi = vapiInstances[assistantId];
    if (!vapi || loadingStates[assistantId]) return;

    setLoadingStates((prev) => ({ ...prev, [assistantId]: true }));
    try {
      await vapi.stop();
    } catch (error) {
      console.error("Failed to stop call:", error);
      setLoadingStates((prev) => ({ ...prev, [assistantId]: false }));
    }
  };

  const AssistantCard = ({ assistant }) => {
    const IconComponent = assistant.icon;
    const isCallActive = callStates[assistant.id];
    const isLoading = loadingStates[assistant.id];

    return (
      <div
        className={`border-2 ${assistant.borderColor} cursor-pointer transition-all duration-300 rounded-lg bg-white/5 backdrop-blur-sm shadow-2xl`}
      >
        <div className="pt-8 pb-8 px-6 flex flex-col items-center text-center">
          <div
            className={`p-4 bg-gradient-to-r ${assistant.gradient} rounded-full mb-6 shadow-lg`}
          >
            <IconComponent className="h-10 w-10 text-white" />
          </div>

          <h2
            className={`text-2xl font-bold text-white mb-3 bg-gradient-to-r ${assistant.gradient} bg-clip-text text-transparent`}
          >
            {assistant.name}
          </h2>

          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed text-sm">
            {assistant.description}
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
                onClick={() =>
                  handleStartCall(assistant.id, assistant.assistantId)
                }
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r ${assistant.gradient} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${assistant.shadowColor} flex items-center justify-center gap-2`}
              >
                {isLoading ? (
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
                onClick={() => handleStopCall(assistant.id)}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
              >
                {isLoading ? (
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
              {assistant.name} can help with:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              {assistant.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-1 h-1 bg-gradient-to-r ${assistant.gradient} rounded-full`}
                  ></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold  mb-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
          Health Voice Assistants
        </h1>

        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Your comprehensive suite of AI-powered health companions, ready to
          provide personalized guidance, support, and expert knowledge across
          various health domains - all through natural voice conversations.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assistants.map((assistant) => (
            <AssistantCard key={assistant.id} assistant={assistant} />
          ))}
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-12 max-w-2xl mx-auto">
        Always consult with healthcare professionals for medical advice. These
        assistants provide educational information and support but are not a
        substitute for professional medical care.
      </p>
    </div>
  );
}
