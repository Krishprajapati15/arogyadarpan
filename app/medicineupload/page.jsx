"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function MedicineUploadPage() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (files) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-auto border border-dashed bg-white dark:bg-black mt-36  border-neutral-200 dark:border-neutral-800">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
