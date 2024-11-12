"use client"
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Close Icon
import { FaAngleDown } from 'react-icons/fa'; // Dropdown Icon

interface ModalProps {
  isOpen: boolean; // Indicates whether the modal is open
  onClose: () => void; // Function to close the modal
  title?: string; // Optional title for the modal
  content?: string; // Optional content for the modal
}

const Modalmail: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  // If the modal isn't open, return null (i.e., don't render anything)
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80"
      aria-hidden={!isOpen}
    >
      <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-lg dark:bg-gray-700">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mail
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:text-white"
            onClick={onClose}
          >
            <AiOutlineClose className="w-5 h-5" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="To"
            className="w-full border-b py-2 focus:outline-none text-gray-800 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Subject Field */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Subject"
            className="w-full border-b py-2 focus:outline-none text-gray-800 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Message Body */}
        <div className="mb-4">
          <textarea
            placeholder="Compose your message..."
            className="w-full h-40 focus:outline-none text-gray-800 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          ></textarea>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center border-t pt-2">
          <div className="flex items-center bg-gray-600 gap-2 p-1 rounded-3xl">
            <button className="bg-gray-600 flex items-center gap-2 rounded-full text-white px-4 py-2 hover:bg-gray-700 focus:ring-4 focus:outline-none">
              Send
            </button>
            <span className="text-white">
              <FaAngleDown />
            </span>
          </div>
          <div className="flex space-x-2">
            {/* Formatting and other icons */}
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">A</button>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">📎</button>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">😊</button>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">🚫</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modalmail;
