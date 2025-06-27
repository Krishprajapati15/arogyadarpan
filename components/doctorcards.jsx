"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[30rem]  rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
          Trusted by Experts.
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover how ArogyaDarpan is empowering healthcare professionals —
          enabling doctors to connect, consult, and care beyond boundaries.
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "I believe that technology can bridge the gap between timely treatment and rural patients. ArogyaDarpan empowers me to do exactly that — offer care, fast and reliably.",
    name: "Dr. Meera Joshi",
    title: "Cardiologist",
  },
  {
    quote:
      "With ArogyaDarpan, I can connect with patients beyond clinic walls. It's healthcare without boundaries, and it's the future we need.",
    name: "Dr. Rajiv Kapoor",
    title: "General Physician",
  },
  {
    quote:
      "I’ve seen countless lives changed because of early detection. Platforms like ArogyaDarpan help patients take that crucial first step — from awareness to action.",
    name: "Dr. Ayesha Siddiqui",
    title: "Oncologist",
  },
  {
    quote:
      "Being available online allows me to help busy working individuals prioritize mental wellness — something we all need more of today.",
    name: "Dr. Arjun Patel",
    title: "Psychiatrist",
  },
  {
    quote:
      "For a pediatrician, trust and accessibility are everything. ArogyaDarpan makes both possible, helping parents get the guidance they need quickly.",
    name: "Dr. Neeta Sharma",
    title: "Pediatrician",
  },
];
