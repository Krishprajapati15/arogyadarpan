"use client";

import React from "react";
import { LoaderThree } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoaderThree />
    </div>
  );
}
