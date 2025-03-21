// src/components/common/ErrorDisplay.jsx
import React from "react";

function ErrorDisplay({ message }) {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
      role="alert"
    >
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
}

export default ErrorDisplay;
