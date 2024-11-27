'use client'; // Specify that this is a Client Component

import React, { useState } from 'react';

const Settings = () => {
  // State to handle the API text and popover visibility
  const [apiText, setApiText] = useState('08710c56-5de1-4452-b7af-4f06bfcb2096'); // Predefined API Key
  const [showPopover, setShowPopover] = useState(false); // State for popover visibility

  // Function to copy the API text to clipboard
  const copyToClipboard = (copyText: string) => {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setShowPopover(true); // Show popover when text is copied
        setTimeout(() => setShowPopover(false), 3000); // Hide popover after 2 seconds
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  return (
    <div className="p-6 font-sans relative">
      {/* Button that triggers the popover and copies the API text */}
      <button
        onClick={() => copyToClipboard(apiText)} // Copy the API key when clicked
        type="button"
        className="text-white bg-gray-600   focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Copy API Key
      </button>

      {/* Popover that shows when text is copied */}
      {showPopover && (
        <div
          role="tooltip"
          className="absolute ml-7 z-10 inline-block w-72 text-sm text-gray-100 transition-opacity duration-300 bg-gray-400 border border-gray-200 rounded-lg shadow-sm mt-2"
        >
          <div className="px-3 py-2 bg-gray-600 border-b border-gray-200 rounded-t-lg">
            <h3 className="font-semibold text-gray-300">Success!Copy text to Clipboard</h3>
          </div>
          <div className="px-3 text-black py-2">
            <a onClick={() => copyToClipboard(apiText)} >08710c56-5de1-4452-b7af-4f06bfcb2096</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
