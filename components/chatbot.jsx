"use client";

import { useEffect } from "react";

const clientId = "cc87ac42-f186-4837-9893-41c3499c6731";

export default function BotpressIntegration() {
  useEffect(() => {
    // Create and inject the Botpress script
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    script.async = true;

    script.onload = () => {
      // Initialize Botpress after script loads
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          clientId: clientId,
          hostUrl: "https://cdn.botpress.cloud/webchat/v1",
          messagingUrl: "https://messaging.botpress.cloud",
          botName: "Your Bot",
          botAvatar: undefined,
          botDescription: "This is your bot description",
          email: {
            title: "stratus@botpress.com",
            link: "mailto:stratus@botpress.com",
          },
          phone: {
            title: "555-555-5555",
            link: "tel:555-555-5555",
          },
          website: {
            title: "https://botpress.com",
            link: "https://botpress.com",
          },
          termsOfService: {
            title: "Terms of Service",
            link: "https://botpress.com/terms",
          },
          privacyPolicy: {
            title: "Privacy Policy",
            link: "https://botpress.com/privacy",
          },
          theme: "prism",
          themeColor: "#000000",
        });
      }
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
